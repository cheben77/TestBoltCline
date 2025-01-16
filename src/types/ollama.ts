export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaError extends Error {
  status?: number;
  code?: string;
  requestId?: string;
}

export interface EmbeddingRequest {
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
    top_p?: number;
  };
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  total_duration?: number;
}
