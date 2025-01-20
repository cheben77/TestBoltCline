import { useState, useCallback } from 'react';

<<<<<<< HEAD
export function useChatError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: Error | string) => {
    const errorMessage = error instanceof Error ? error.message : error;
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryOperation = useCallback(() => {
    clearError();
    // Retourner true pour indiquer que l'erreur a été effacée et qu'on peut réessayer
    return true;
  }, [clearError]);

  return {
    error,
    handleError,
    clearError,
    retryOperation,
=======
export type ChatErrorType = 
  | 'network'
  | 'notion'
  | 'ollama'
  | 'file'
  | 'validation'
  | 'unknown';

export interface ChatError extends Error {
  type: ChatErrorType;
  details?: any;
  timestamp: Date;
}

export interface ChatErrorState {
  current: ChatError | null;
  history: ChatError[];
}

export function createChatError(
  message: string,
  type: ChatErrorType = 'unknown',
  details?: any
): ChatError {
  return {
    name: 'ChatError',
    message,
    type,
    details,
    timestamp: new Date()
  };
}

interface UseChatErrorOptions {
  maxHistoryLength?: number;
  onError?: (error: ChatError) => void;
}

export function useChatError(options: UseChatErrorOptions = {}) {
  const { maxHistoryLength = 10, onError } = options;
  const [errorState, setErrorState] = useState<ChatErrorState>({
    current: null,
    history: []
  });

  const handleError = useCallback((error: Error | string, type?: ChatErrorType, details?: any) => {
    const chatError = typeof error === 'string' 
      ? createChatError(error, type, details)
      : {
          ...createChatError(error.message, type, details),
          stack: error.stack
        };

    setErrorState(prev => {
      const newHistory = [chatError, ...prev.history].slice(0, maxHistoryLength);
      return {
        current: chatError,
        history: newHistory
      };
    });

    onError?.(chatError);
    return chatError;
  }, [maxHistoryLength, onError]);

  const clearError = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      current: null
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setErrorState({
      current: null,
      history: []
    });
  }, []);

  const getErrorMessage = useCallback((error: ChatError): string => {
    switch (error.type) {
      case 'network':
        return 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
      case 'notion':
        return 'Erreur lors de l\'accès à la base de données Notion.';
      case 'ollama':
        return 'Erreur lors de la génération de la réponse.';
      case 'file':
        return 'Erreur lors du traitement du fichier.';
      case 'validation':
        return 'Les données fournies sont invalides.';
      default:
        return error.message || 'Une erreur inattendue est survenue.';
    }
  }, []);

  const isNetworkError = useCallback((error: unknown): boolean => {
    if (error instanceof Error) {
      return (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed') ||
        error.message.includes('ECONNREFUSED')
      );
    }
    return false;
  }, []);

  return {
    error: errorState.current,
    errorHistory: errorState.history,
    handleError,
    clearError,
    clearHistory,
    getErrorMessage,
    isNetworkError
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  };
}

export default useChatError;
