/**
 * OpenRouter Service - Client-side integration for OpenRouter API via Edge Function proxy
 * 
 * This service provides a clean interface for making OpenAI-compatible requests to OpenRouter
 * through the Vercel Edge Function proxy, which handles authentication securely.
 */

import { 
  OpenRouterMessage, 
  OpenRouterChatRequest, 
  OpenRouterChatResponse,
  StreamingChunk 
} from '../api/types';
import { DEFAULT_OPENROUTER_MODEL } from '../constants';

/**
 * Configuration for OpenRouter service
 */
export interface OpenRouterServiceConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  baseUrl?: string;
}

/**
 * Generated email result
 */
export interface GeneratedEmail {
  subject: string;
  body: string;
}

/**
 * Error response from service
 */
export interface ServiceError {
  message: string;
  type: 'network' | 'api' | 'parsing' | 'unknown';
  statusCode?: number;
}

/**
 * OpenRouter Service class
 */
export class OpenRouterService {
  private config: Required<OpenRouterServiceConfig>;
  private baseUrl: string;

  constructor(config: OpenRouterServiceConfig = {}) {
    this.baseUrl = config.baseUrl || '/api/proxy';
    this.config = {
      model: config.model || DEFAULT_OPENROUTER_MODEL,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2048,
      topP: config.topP ?? 1.0,
      stream: config.stream ?? false,
      baseUrl: config.baseUrl || '/api/proxy',
    };
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<OpenRouterServiceConfig>): void {
    Object.assign(this.config, config);
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    }
  }

  /**
   * Build the API endpoint URL
   */
  private getEndpoint(): string {
    return `${this.baseUrl}/chat/completions`;
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown, statusCode?: number): ServiceError {
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return {
          message: 'Network error: Unable to connect to the API',
          type: 'network',
          statusCode,
        };
      }
      return {
        message: error.message,
        type: 'api',
        statusCode,
      };
    }
    return {
      message: 'An unknown error occurred',
      type: 'unknown',
      statusCode,
    };
  }

  /**
   * Parse streaming response
   */
  private parseStreamChunk(line: string): StreamingChunk | null {
    if (!line.startsWith('data: ')) {
      return null;
    }

    const data = line.slice(6).trim();
    if (data === '[DONE]') {
      return null;
    }

    try {
      return JSON.parse(data) as StreamingChunk;
    } catch {
      return null;
    }
  }

  /**
   * Make a chat completion request (non-streaming)
   */
  async chatCompletion(
    messages: OpenRouterMessage[],
    options: Partial<OpenRouterServiceConfig> = {}
  ): Promise<OpenRouterChatResponse> {
    const requestConfig = { ...this.config, ...options };
    const endpoint = this.getEndpoint();

    const requestBody: OpenRouterChatRequest = {
      model: requestConfig.model,
      messages,
      temperature: requestConfig.temperature,
      max_tokens: requestConfig.maxTokens,
      top_p: requestConfig.topP,
      stream: false,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API error: ${response.statusText}`
        );
      }

      const data: OpenRouterChatResponse = await response.json();
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a streaming chat completion request
   */
  async *chatCompletionStream(
    messages: OpenRouterMessage[],
    options: Partial<OpenRouterServiceConfig> = {}
  ): AsyncGenerator<StreamingChunk, void, unknown> {
    const requestConfig = { ...this.config, ...options };
    const endpoint = this.getEndpoint();

    const requestBody: OpenRouterChatRequest = {
      model: requestConfig.model,
      messages,
      temperature: requestConfig.temperature,
      max_tokens: requestConfig.maxTokens,
      top_p: requestConfig.topP,
      stream: true,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API error: ${response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const chunk = this.parseStreamChunk(line);
          if (chunk) {
            yield chunk;
          }
        }
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate an objection email (non-streaming)
   */
  async generateObjectionEmail(
    prompt: string,
    options: Partial<OpenRouterServiceConfig> = {}
  ): Promise<GeneratedEmail> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are an advocacy expert helping citizens of Tamil Nadu challenge Rule 288-A.
CONTEXT: Rule 288-A allows hiring/leasing for regular operations, creating a de facto bar on state procurement.
KEY TRUTH: Existing Chennai GCC (leased) buses exclude women from "Vidiyal Payanam".
GOAL: Generate a formal objection letter based on the user's request.
STRESS: The state MUST purchase and own the fleet for accountability and rural welfare.
ALWAYS INCLUDE: "Public Transit is Public Property" (பொதுப் போக்குவரத்து மக்கள் சொத்து).

IMPORTANT: You must respond with valid JSON only, in this exact format:
{
  "subject": "Email subject line",
  "body": "Complete letter body"
}`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await this.chatCompletion(messages, {
        ...options,
        temperature: 0.7,
        maxTokens: 2048,
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const result = JSON.parse(jsonMatch[0]) as GeneratedEmail;

      if (!result.subject || !result.body) {
        throw new Error('Invalid email structure in AI response');
      }

      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate an objection email (streaming)
   */
  async *generateObjectionEmailStream(
    prompt: string,
    options: Partial<OpenRouterServiceConfig> = {}
  ): AsyncGenerator<string, void, unknown> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are an advocacy expert helping citizens of Tamil Nadu challenge Rule 288-A.
CONTEXT: Rule 288-A allows hiring/leasing for regular operations, creating a de facto bar on state procurement.
KEY TRUTH: Existing Chennai GCC (leased) buses exclude women from "Vidiyal Payanam".
GOAL: Generate a formal objection letter based on the user's request.
STRESS: The state MUST purchase and own the fleet for accountability and rural welfare.
ALWAYS INCLUDE: "Public Transit is Public Property" (பொதுப் போக்குவரத்து மக்கள் சொத்து).

IMPORTANT: You must respond with valid JSON only, in this exact format:
{
  "subject": "Email subject line",
  "body": "Complete letter body"
}`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    let fullContent = '';

    try {
      for await (const chunk of this.chatCompletionStream(messages, {
        ...options,
        temperature: 0.7,
        maxTokens: 2048,
      })) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          yield delta;
        }
      }

      // Validate final response
      const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const result = JSON.parse(jsonMatch[0]) as GeneratedEmail;

      if (!result.subject || !result.body) {
        throw new Error('Invalid email structure in AI response');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Test the connection to the API
   */
  async testConnection(): Promise<{ success: boolean; message: string; modelUsed?: string }> {
    try {
      const response = await this.chatCompletion([
        {
          role: 'user',
          content: 'Respond with "OK"',
        },
      ], {
        maxTokens: 10,
      });

      const modelUsed = response.model;
      const content = response.choices[0]?.message?.content || '';

      if (content.includes('OK')) {
        return {
          success: true,
          message: 'Connection successful',
          modelUsed,
        };
      }

      return {
        success: false,
        message: 'Unexpected response from API',
        modelUsed,
      };
    } catch (error) {
      const serviceError = this.handleError(error);
      return {
        success: false,
        message: serviceError.message,
      };
    }
  }
}

/**
 * Default instance of OpenRouter service
 */
export const openRouterService = new OpenRouterService();

/**
 * Convenience function to generate objection email
 */
export async function generateObjectionEmail(
  prompt: string,
  config?: Partial<OpenRouterServiceConfig>
): Promise<GeneratedEmail> {
  return openRouterService.generateObjectionEmail(prompt, config);
}
