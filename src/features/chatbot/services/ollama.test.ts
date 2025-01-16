import { ollamaService } from './ollama';
import { ChatMessage } from '@/types/ollama';
import fetchMock from 'jest-fetch-mock';

describe('OllamaService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('chat', () => {
    const mockMessages: ChatMessage[] = [
      { role: 'user', content: 'Bonjour' }
    ];

    it('envoie une requête correcte et retourne la réponse', async () => {
      const mockResponse = {
        message: {
          role: 'assistant' as const,
          content: 'Bonjour ! Comment puis-je vous aider ?'
        }
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const response = await ollamaService.chat({
        model: 'codestral:latest',
        messages: mockMessages
      });

      expect(response.message.role).toBe('assistant');
      expect(response.message.content).toBe('Bonjour ! Comment puis-je vous aider ?');
      expect(response.done).toBe(true);

      const fetchCall = fetchMock.mock.calls[0];
      expect(fetchCall[0]).toContain('/api/chat');
      expect(JSON.parse(fetchCall[1]?.body as string)).toEqual({
        model: 'codestral:latest',
        messages: mockMessages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        }
      });
    });

    it('gère les erreurs de réponse', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(ollamaService.chat({
        model: 'codestral:latest',
        messages: mockMessages
      })).rejects.toThrow('Erreur lors de la communication avec le modèle de langage');
    });

    it('gère les timeouts', async () => {
      fetchMock.mockAbort();

      await expect(ollamaService.chat({
        model: 'codestral:latest',
        messages: mockMessages
      })).rejects.toThrow('La requête a été interrompue en raison d\'un délai d\'attente dépassé');
    });
  });

  describe('getModels', () => {
    it('retourne la liste des modèles', async () => {
      const mockModels = {
        models: [
          { name: 'codestral:latest' },
          { name: 'mistral:latest' }
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockModels));

      const models = await ollamaService.getModels();

      expect(models).toEqual(['codestral:latest', 'mistral:latest']);
      expect(fetchMock.mock.calls[0][0]).toContain('/api/tags');
    });

    it('gère les erreurs lors de la récupération des modèles', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(ollamaService.getModels()).rejects.toThrow('Impossible de récupérer la liste des modèles');
    });
  });
});
