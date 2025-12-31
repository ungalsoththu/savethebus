/**
 * Type definitions for OpenRouter API and Edge Function
 */

/**
 * OpenRouter message role types
 */
export type OpenRouterMessageRole = 'system' | 'user' | 'assistant';

/**
 * OpenRouter message structure
 */
export interface OpenRouterMessage {
  role: OpenRouterMessageRole;
  content: string;
}

/**
 * OpenRouter chat completion request
 */
export interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
  presence_penalty?: number;
  frequency_penalty?: number;
}

/**
 * OpenRouter message delta (for streaming)
 */
export interface OpenRouterMessageDelta {
  role?: string;
  content?: string;
}

/**
 * OpenRouter choice in response
 */
export interface OpenRouterChoice {
  index: number;
  message?: {
    role: string;
    content: string;
  };
  delta?: OpenRouterMessageDelta;
  finish_reason?: string | null;
}

/**
 * OpenRouter usage statistics
 */
export interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * OpenRouter chat completion response
 */
export interface OpenRouterChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage?: OpenRouterUsage;
}

/**
 * OpenRouter error response
 */
export interface OpenRouterErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
    param?: string;
  };
}

/**
 * AI Provider type
 */
export type AIProvider = 'gemini' | 'openrouter';

/**
 * AI Provider configuration
 */
export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  pricing?: {
    input: number;
    output: number;
    currency: string;
  };
  capabilities: string[];
}

/**
 * Edge Function configuration
 */
export interface EdgeFunctionConfig {
  provider: AIProvider;
  openRouterApiKey?: string;
  geminiApiKey?: string;
  openRouterSiteUrl?: string;
  openRouterAppName?: string;
  defaultModel?: string;
}

/**
 * Streaming chunk
 */
export interface StreamingChunk {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: {
    index: number;
    delta: OpenRouterMessageDelta;
    finish_reason: string | null;
  }[];
}

/**
 * SSE event types
 */
export type SSEEventType = 'data' | 'error' | 'done';

/**
 * SSE event
 */
export interface SSEEvent {
  type: SSEEventType;
  data?: unknown;
  error?: string;
}
