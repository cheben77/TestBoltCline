<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';

export interface ServiceStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface ConnectionState {
  ollamaStatus: ServiceStatus;
  notionStatus: ServiceStatus;
  cudaStatus: ServiceStatus;
}

const initialState: ConnectionState = {
  ollamaStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  notionStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  cudaStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  }
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
};

export function useChatConnection() {
  const [state, setState] = useState<ConnectionState>(initialState);

<<<<<<< HEAD
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
=======
  const checkConnection = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      return error instanceof Error ? error : new Error(String(error));
    }
  };

  const checkConnections = async () => {
    // Vérifier Ollama
    setState(prev => ({
      ...prev,
      ollamaStatus: { ...prev.ollamaStatus, isLoading: true }
    }));
    const ollamaResult = await checkConnection('/api/chat/connect/ollama');
    setState(prev => ({
      ...prev,
      ollamaStatus: {
        isConnected: ollamaResult === true,
        isLoading: false,
        error: ollamaResult === true ? null : ollamaResult as Error
      }
    }));

    // Vérifier Notion
    setState(prev => ({
      ...prev,
      notionStatus: { ...prev.notionStatus, isLoading: true }
    }));
    const notionResult = await checkConnection('/api/chat/connect/notion');
    setState(prev => ({
      ...prev,
      notionStatus: {
        isConnected: notionResult === true,
        isLoading: false,
        error: notionResult === true ? null : notionResult as Error
      }
    }));

    // Vérifier CUDA
    setState(prev => ({
      ...prev,
      cudaStatus: { ...prev.cudaStatus, isLoading: true }
    }));
    const cudaResult = await checkConnection('/api/chat/connect/cuda');
    setState(prev => ({
      ...prev,
      cudaStatus: {
        isConnected: cudaResult === true,
        isLoading: false,
        error: cudaResult === true ? null : cudaResult as Error
      }
    }));
  };

  useEffect(() => {
    checkConnections();
  }, []);

  return {
    ollamaStatus: state.ollamaStatus,
    notionStatus: state.notionStatus,
    cudaStatus: state.cudaStatus,
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    checkConnections
  };
}

export default useChatConnection;
