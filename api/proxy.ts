/**
 * Vercel Edge Function - OpenRouter Proxy
 * 
 * A stateless proxy that securely routes OpenAI-compatible LLM requests to OpenRouter API.
 * 
 * Features:
 * - Streaming responses using Server-Sent Events (SSE)
 * - CORS support for browser-based access
 * - Automatic API key injection from environment variables
 * - Request payload forwarding with header sanitization
 * - Robust error handling
 * - Edge runtime optimized (no Node.js modules)
 * 
 * Environment Variables:
 * - OPENROUTER_API_KEY: Required - OpenRouter API key
 * - AI_PROVIDER: Optional - 'openrouter' or 'gemini' (default: 'openrouter')
 * - OPENROUTER_SITE_URL: Optional - Site URL for OpenRouter analytics
 * - OPENROUTER_APP_NAME: Optional - App name for OpenRouter analytics
 */

// Type definitions for OpenRouter API
interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
}

interface OpenRouterChoice {
  index: number;
  message?: {
    role: string;
    content: string;
  };
  delta?: {
    role?: string;
    content?: string;
  };
  finish_reason?: string | null;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// Configuration constants
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2048;

/**
 * Validates required environment variables
 */
function validateEnvironment(env: any): { valid: boolean; error?: string } {
  const apiKey = env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      error: 'OPENROUTER_API_KEY environment variable is not configured'
    };
  }
  
  return { valid: true };
}

/**
 * Sanitizes headers by removing conflicting authorization headers
 */
function sanitizeHeaders(headers: Headers): Headers {
  const sanitized = new Headers();
  
  // Copy all headers except Authorization
  headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'authorization') {
      sanitized.append(key, value);
    }
  });
  
  return sanitized;
}

/**
 * Builds headers for the OpenRouter API request
 */
function buildOpenRouterHeaders(originalHeaders: Headers, env: any): Headers {
  const headers = new Headers();
  
  // Copy sanitized headers from original request
  const sanitized = sanitizeHeaders(originalHeaders);
  sanitized.forEach((value, key) => {
    headers.append(key, value);
  });
  
  // Add OpenRouter-specific headers
  headers.append('Authorization', `Bearer ${env.OPENROUTER_API_KEY}`);
  headers.append('HTTP-Referer', env.OPENROUTER_SITE_URL || 'https://savethebus.vercel.app');
  headers.append('X-Title', env.OPENROUTER_APP_NAME || 'SaveTheBus');
  
  // Ensure content type is set
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  
  return headers;
}

/**
 * Validates the request payload
 */
function validateRequest(body: Partial<OpenRouterRequest>): { valid: boolean; error?: string } {
  if (!body.model) {
    return { valid: false, error: 'Model is required in request body' };
  }
  
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return { valid: false, error: 'Messages array is required and must not be empty' };
  }
  
  // Validate each message
  for (let i = 0; i < body.messages.length; i++) {
    const msg = body.messages[i];
    if (!msg.role || !msg.content) {
      return { 
        valid: false, 
        error: `Message at index ${i} is missing required 'role' or 'content' field` 
      };
    }
    
    if (!['system', 'user', 'assistant'].includes(msg.role)) {
      return { 
        valid: false, 
        error: `Message at index ${i} has invalid role: ${msg.role}` 
      };
    }
  }
  
  return { valid: true };
}

/**
 * Handles streaming response from OpenRouter
 */
async function handleStreamResponse(
  response: Response,
  requestModel: string
): Promise<Response> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Unable to read response body');
  }
  
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Create a TransformStream to process SSE chunks
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith(':')) {
              continue;
            }
            
            // Parse SSE data line
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6);
              
              // Check for end of stream
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                break;
              }
              
              try {
                // Parse and forward the JSON chunk
                const chunk = JSON.parse(data);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              } catch (e) {
                // Forward invalid data as-is
                controller.enqueue(encoder.encode(`${trimmed}\n\n`));
              }
            } else {
              // Forward non-data lines as-is
              controller.enqueue(encoder.encode(`${trimmed}\n\n`));
            }
          }
        }
        
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Model-Used': requestModel,
    },
  });
}

/**
 * Handles non-streaming response from OpenRouter
 */
async function handleNonStreamResponse(
  response: Response,
  requestModel: string
): Promise<Response> {
  const data: OpenRouterResponse = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Model-Used': requestModel,
    },
  });
}

/**
 * Handles OPTIONS requests for CORS preflight
 */
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Handles GET requests - returns API information
 */
function handleGet(): Response {
  return new Response(JSON.stringify({
    name: 'OpenRouter Proxy',
    version: '1.0.0',
    status: 'operational',
    provider: 'openrouter',
    endpoints: {
      chat: '/api/proxy/chat/completions',
    },
    documentation: 'https://openrouter.ai/docs',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Main handler for POST requests
 */
async function handlePost(request: Request, pathname: string, env: any): Promise<Response> {
  // Validate environment
  const envValidation = validateEnvironment(env);
  if (!envValidation.valid) {
    return new Response(
      JSON.stringify({ error: envValidation.error }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
  
  try {
    // Parse request body
    const body: Partial<OpenRouterRequest> = await request.json();
    
    // Validate request
    const requestValidation = validateRequest(body);
    if (!requestValidation.valid) {
      return new Response(
        JSON.stringify({ error: requestValidation.error }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    // Set defaults if not provided
    const requestBody: OpenRouterRequest = {
      model: body.model!,
      messages: body.messages!,
      temperature: body.temperature ?? DEFAULT_TEMPERATURE,
      max_tokens: body.max_tokens ?? DEFAULT_MAX_TOKENS,
      top_p: body.top_p,
      stream: body.stream ?? false,
      stop: body.stop,
    };
    
    // Build headers for upstream request
    const headers = buildOpenRouterHeaders(env, request.headers);
    
    // Make request to OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
    
    // Handle upstream errors
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        error: {
          message: `OpenRouter API error: ${response.statusText}`,
          type: 'upstream_error',
        }
      }));
      
      return new Response(
        JSON.stringify(errorData),
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Model-Used': requestBody.model,
          }
        }
      );
    }
    
    // Handle streaming vs non-streaming responses
    if (requestBody.stream) {
      return handleStreamResponse(response, requestBody.model);
    } else {
      return handleNonStreamResponse(response, requestBody.model);
    }
    
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: {
          message: `Proxy error: ${errorMessage}`,
          type: 'proxy_error',
        }
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

/**
 * Edge Function entry point
 */
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;
    
    // Route based on method and path
    if (method === 'OPTIONS') {
      return handleOptions();
    }
    
    if (method === 'GET') {
      if (pathname === '/api/proxy') {
        return handleGet();
      }
      
      // Handle chat completions endpoint
      if (pathname === '/api/proxy/chat/completions') {
        return new Response(
          JSON.stringify({ error: 'Use POST method for chat completions' }),
          {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
              'Allow': 'POST, OPTIONS',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Endpoint not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    if (method === 'POST') {
      if (pathname === '/api/proxy/chat/completions') {
        return handlePost(request, pathname, env);
      }
      
      return new Response(
        JSON.stringify({ error: 'Endpoint not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
};
