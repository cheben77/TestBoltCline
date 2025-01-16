import { ChatMessage } from '@/types/ollama';

const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434';

interface OllamaResponse {
  message: ChatMessage;
  done: boolean;
}

class OllamaService {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 30000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async chat({ model, messages }: { model: string; messages: ChatMessage[] }): Promise<OllamaResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `${OLLAMA_API_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur Ollama: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: {
          role: 'assistant',
          content: data.message.content,
        },
        done: true,
      };
    } catch (error) {
      console.error('Erreur lors de la communication avec Ollama:', error);
      throw new Error('Erreur lors de la communication avec le modèle de langage');
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${OLLAMA_API_URL}/api/tags`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des modèles: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models.map((model: any) => model.name);
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
      throw new Error('Impossible de récupérer la liste des modèles');
    }
  }
}

export const ollamaService = new OllamaService();
