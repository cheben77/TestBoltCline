import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  OllamaModel,
  OllamaError,
  EmbeddingRequest,
  EmbeddingResponse
} from '@/types/ollama';

export class OllamaService {
  private static instance: OllamaService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
  }

  public static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService();
    }
    return OllamaService.instance;
  }

  private handleError(error: any): OllamaError {
    const ollamaError = new Error(error.message) as OllamaError;
    ollamaError.status = error.status;
    ollamaError.code = error.code;
    ollamaError.requestId = error.requestId;
    return ollamaError;
  }

  public async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw this.handleError(error);
    }
  }

  public async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error getting Ollama models:', error);
      throw this.handleError(error);
    }
  }

  public async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw this.handleError(error);
    }
  }

  public async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const models = await this.getModels();
      return models.some(model => model.name === modelName);
    } catch (error) {
      console.error('Error checking model availability:', error);
      return false;
    }
  }
}

export const ollamaService = OllamaService.getInstance();
