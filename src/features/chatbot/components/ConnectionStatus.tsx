import React from 'react';
import { useChatConnection } from '../hooks/useChatConnection';

interface ConnectionStatusProps {
  service: 'ollama' | 'notion' | 'cuda' | 'vscode' | 'internet' | 'spotify' | 'google' | 'youtube';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ service }) => {
  const { 
    ollamaStatus, 
    notionStatus, 
    cudaStatus, 
    vscodeStatus, 
    internetStatus, 
    spotifyStatus,
    googleStatus,
    youtubeStatus
  } = useChatConnection();

  const getStatus = () => {
    switch (service) {
      case 'ollama':
        return ollamaStatus;
      case 'notion':
        return notionStatus;
      case 'cuda':
        return cudaStatus;
      case 'vscode':
        return vscodeStatus;
      case 'internet':
        return internetStatus;
      case 'spotify':
        return spotifyStatus;
      case 'google':
        return googleStatus;
      case 'youtube':
        return youtubeStatus;
      default:
        return false;
    }
  };

  const status = getStatus();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
      status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        status ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className="text-sm font-medium">
        {status ? 'Connecté' : 'Non connecté'}
      </span>
    </div>
  );
};
