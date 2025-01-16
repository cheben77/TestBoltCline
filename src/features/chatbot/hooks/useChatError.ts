import { useState, useCallback } from 'react';

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
  };
}

export default useChatError;
