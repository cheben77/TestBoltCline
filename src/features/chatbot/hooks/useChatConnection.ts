import { useState, useCallback, useEffect } from 'react';

interface ServiceStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ConnectionState {
  ollama: ServiceStatus;
  notion: ServiceStatus;
  cuda: ServiceStatus;
}

const initialState: ConnectionState = {
  ollama: { isConnected: false, isLoading: true, error: null },
  notion: { isConnected: false, isLoading: true, error: null },
  cuda: { isConnected: false, isLoading: true, error: null }
};

export function useChatConnection() {
  const [state, setState] = useState<ConnectionState>(initialState);

  const checkOllama = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/connect/ollama');
      if (!response.ok) throw new Error('Erreur de connexion Ollama');
      const data = await response.json();
      return { isConnected: data.connected, error: null };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, []);

  const checkNotion = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/connect/notion');
      if (!response.ok) throw new Error('Erreur de connexion Notion');
      const data = await response.json();
      return { isConnected: data.connected, error: null };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, []);

  const checkCuda = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/connect/cuda');
      if (!response.ok) throw new Error('CUDA non disponible');
      const data = await response.json();
      return { isConnected: data.available, error: null };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, []);

  const checkConnections = useCallback(async () => {
    setState(prev => ({
      ollama: { ...prev.ollama, isLoading: true, error: null },
      notion: { ...prev.notion, isLoading: true, error: null },
      cuda: { ...prev.cuda, isLoading: true, error: null }
    }));

    const [ollamaStatus, notionStatus, cudaStatus] = await Promise.all([
      checkOllama(),
      checkNotion(),
      checkCuda()
    ]);

    setState({
      ollama: { isConnected: ollamaStatus.isConnected, isLoading: false, error: ollamaStatus.error },
      notion: { isConnected: notionStatus.isConnected, isLoading: false, error: notionStatus.error },
      cuda: { isConnected: cudaStatus.isConnected, isLoading: false, error: cudaStatus.error }
    });
  }, [checkOllama, checkNotion, checkCuda]);

  useEffect(() => {
    checkConnections();
  }, [checkConnections]);

  return {
    ollamaStatus: state.ollama,
    notionStatus: state.notion,
    cudaStatus: state.cuda,
    checkConnections
  };
}

export default useChatConnection;
