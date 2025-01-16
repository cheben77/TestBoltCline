import React from 'react';
import { useChatConnection } from '../hooks/useChatConnection';

export function ConnectionStatus() {
  const { ollamaStatus, notionStatus, cudaStatus } = useChatConnection();

  const getStatusColor = (isConnected: boolean, isLoading: boolean, error: Error | null) => {
    if (isLoading) return 'bg-yellow-500';
    if (error) return 'bg-red-500';
    return isConnected ? 'bg-green-500' : 'bg-gray-500';
  };

  const getStatusText = (isConnected: boolean, isLoading: boolean, error: Error | null) => {
    if (isLoading) return 'Connexion...';
    if (error) return 'Erreur';
    return isConnected ? 'Connecté' : 'Déconnecté';
  };

  const renderStatus = (
    name: string,
    { isConnected, isLoading, error }: { isConnected: boolean; isLoading: boolean; error: Error | null }
  ) => (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${getStatusColor(isConnected, isLoading, error)}`}
        title={error?.message}
      />
      <span className="font-medium">{name}</span>
      <span className="text-sm text-gray-500">
        {getStatusText(isConnected, isLoading, error)}
      </span>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">État des connexions</h3>
      <div className="space-y-2">
        {renderStatus('Ollama', ollamaStatus)}
        {renderStatus('Notion', notionStatus)}
        {renderStatus('CUDA', cudaStatus)}
      </div>
    </div>
  );
}

export default ConnectionStatus;
