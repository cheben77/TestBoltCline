import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/ollama';

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, context?: { type: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message de l'utilisateur
      const userMessage: ChatMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // Envoyer la requête à l'API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();

      // Ajouter la réponse de l'assistant
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Erreur dans useChatbot:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setMessages(prev => prev.slice(0, -1)); // Retirer le dernier message en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    clearError,
  };
}
