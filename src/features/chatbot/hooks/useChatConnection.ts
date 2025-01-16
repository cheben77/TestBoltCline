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
};

export function useChatConnection() {
  const [state, setState] = useState<ConnectionState>(initialState);

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
    checkConnections
  };
}

export default useChatConnection;
