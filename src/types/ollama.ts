export type ChatRole = 'user' | 'system' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
}

export interface ChatResponse {
  message: ChatMessage;
  done: boolean;
}

export interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
  modified_at?: string;
}
