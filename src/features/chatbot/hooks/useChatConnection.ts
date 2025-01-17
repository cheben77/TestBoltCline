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
  vscodeStatus: ServiceStatus;
  internetStatus: ServiceStatus;
  spotifyStatus: ServiceStatus;
  googleStatus: ServiceStatus;
  youtubeStatus: ServiceStatus;
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
  },
  vscodeStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  internetStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  spotifyStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  googleStatus: {
    isConnected: false,
    isLoading: false,
    error: null
  },
  youtubeStatus: {
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
      const data = await response.json();
      return data.status === 'connected';
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return error instanceof Error ? error : new Error(String(error));
    }
  };

  const connectService = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.status === 'connected';
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return error instanceof Error ? error : new Error(String(error));
    }
  };

  const checkConnections = async (connect: boolean = false) => {
    // Vérifier Ollama
    setState(prev => ({
      ...prev,
      ollamaStatus: { ...prev.ollamaStatus, isLoading: true }
    }));
    const ollamaResult = connect ? 
      await connectService('/api/chat/connect/ollama') :
      await checkConnection('/api/chat/connect/ollama');
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
    const notionResult = connect ? 
      await connectService('/api/chat/connect/notion') :
      await checkConnection('/api/chat/connect/notion');
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
    const cudaResult = connect ? 
      await connectService('/api/chat/connect/cuda') :
      await checkConnection('/api/chat/connect/cuda');
    setState(prev => ({
      ...prev,
      cudaStatus: {
        isConnected: cudaResult === true,
        isLoading: false,
        error: cudaResult === true ? null : cudaResult as Error
      }
    }));

    // Vérifier VSCode
    setState(prev => ({
      ...prev,
      vscodeStatus: { ...prev.vscodeStatus, isLoading: true }
    }));
    const vscodeResult = connect ? 
      await connectService('/api/chat/connect/vscode') :
      await checkConnection('/api/chat/connect/vscode');
    setState(prev => ({
      ...prev,
      vscodeStatus: {
        isConnected: vscodeResult === true,
        isLoading: false,
        error: vscodeResult === true ? null : vscodeResult as Error
      }
    }));

    // Vérifier Internet
    setState(prev => ({
      ...prev,
      internetStatus: { ...prev.internetStatus, isLoading: true }
    }));
    const internetResult = connect ? 
      await connectService('/api/chat/connect/internet') :
      await checkConnection('/api/chat/connect/internet');
    setState(prev => ({
      ...prev,
      internetStatus: {
        isConnected: internetResult === true,
        isLoading: false,
        error: internetResult === true ? null : internetResult as Error
      }
    }));

    // Vérifier Spotify
    setState(prev => ({
      ...prev,
      spotifyStatus: { ...prev.spotifyStatus, isLoading: true }
    }));
    const spotifyResult = connect ? 
      await connectService('/api/chat/connect/spotify') :
      await checkConnection('/api/chat/connect/spotify');
    setState(prev => ({
      ...prev,
      spotifyStatus: {
        isConnected: spotifyResult === true,
        isLoading: false,
        error: spotifyResult === true ? null : spotifyResult as Error
      }
    }));

    // Vérifier Google
    setState(prev => ({
      ...prev,
      googleStatus: { ...prev.googleStatus, isLoading: true }
    }));
    const googleResult = connect ? 
      await connectService('/api/chat/connect/google') :
      await checkConnection('/api/chat/connect/google');
    setState(prev => ({
      ...prev,
      googleStatus: {
        isConnected: googleResult === true,
        isLoading: false,
        error: googleResult === true ? null : googleResult as Error
      }
    }));

    // Vérifier YouTube
    setState(prev => ({
      ...prev,
      youtubeStatus: { ...prev.youtubeStatus, isLoading: true }
    }));
    const youtubeResult = connect ? 
      await connectService('/api/chat/connect/youtube') :
      await checkConnection('/api/chat/connect/youtube');
    setState(prev => ({
      ...prev,
      youtubeStatus: {
        isConnected: youtubeResult === true,
        isLoading: false,
        error: youtubeResult === true ? null : youtubeResult as Error
      }
    }));
  };

  return {
    ollamaStatus: state.ollamaStatus,
    notionStatus: state.notionStatus,
    cudaStatus: state.cudaStatus,
    vscodeStatus: state.vscodeStatus,
    internetStatus: state.internetStatus,
    spotifyStatus: state.spotifyStatus,
    googleStatus: state.googleStatus,
    youtubeStatus: state.youtubeStatus,
    checkConnections
  };
}

export default useChatConnection;
