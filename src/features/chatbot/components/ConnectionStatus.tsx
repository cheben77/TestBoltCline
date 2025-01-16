import React from 'react';
import { useChatConnection } from '../hooks/useChatConnection';

interface ServiceStatus {
  name: string;
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
}

export function ConnectionStatus() {
  const { 
    ollamaStatus,
    notionStatus,
    cudaStatus,
    checkConnections
  } = useChatConnection();

  const isLoading = ollamaStatus.isLoading || notionStatus.isLoading || cudaStatus.isLoading;

  const renderStatusIndicator = ({ name, isConnected, isLoading, error }: ServiceStatus) => {
    const testId = name.toLowerCase();

    return (
      <div className="flex items-center space-x-2 p-2">
        <div className="flex-1 font-medium">{name}</div>
        <div className="relative">
          {isLoading ? (
            <div 
              data-testid={`${testId}-loading`}
              className="w-10 h-6 bg-gray-200 rounded-full animate-pulse" 
            />
          ) : (
            <button 
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer
                ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={checkConnections}
              title={error || (isConnected ? 'Connecté' : 'Déconnecté')}
              disabled={isLoading}
            >
              <div 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform
                  ${isConnected ? 'left-5' : 'left-1'}`}
              />
            </button>
          )}
        </div>
        {error && (
          <div 
            className="text-xs text-red-500" 
            title={error}
            data-testid={`${testId}-error`}
          >
            ⚠️
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <h3 className="font-semibold text-lg mb-4">État des connexions</h3>
      {renderStatusIndicator({
        name: 'Ollama',
        ...ollamaStatus
      })}
      {renderStatusIndicator({
        name: 'Notion',
        ...notionStatus
      })}
      {renderStatusIndicator({
        name: 'CUDA',
        ...cudaStatus
      })}
      <button
        onClick={checkConnections}
        disabled={isLoading}
        className={`w-full mt-4 px-4 py-2 text-white rounded transition-colors
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {isLoading ? 'Vérification...' : 'Rafraîchir'}
      </button>
    </div>
  );
}

export default ConnectionStatus;
