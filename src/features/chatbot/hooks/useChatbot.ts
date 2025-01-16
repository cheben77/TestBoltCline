import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types/ollama';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

interface ChatContext {
  type: 'notion' | 'file';
  data?: any;
}

export function useChatbot() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (message: string, context?: ChatContext) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'user', content: message },
          { role: 'assistant', content: data.response }
        ],
        isLoading: false
      }));

      return data.response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      }));
      throw error;
    }
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
    clearError
  };
}

export default useChatbot;
