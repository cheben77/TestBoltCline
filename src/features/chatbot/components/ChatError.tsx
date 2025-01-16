 est bon import React from 'react';
import { useChatError } from '../hooks/useChatError';
import { ConnectionStatus } from './ConnectionStatus';

interface ChatErrorProps {
  message: string;
  onRetry: () => void;
}

export function ChatError({ message, onRetry }: ChatErrorProps) {
  const { clearError } = useChatError();

  const handleRetry = () => {
    clearError();
    onRetry();
  };

  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string;
            const data = JSON.parse(content);
            
            // Envoyer les données au serveur
            const response = await fetch('/api/chat/import', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              throw new Error('Erreur lors de l\'importation');
            }

            // Rafraîchir l'interface
            handleRetry();
          } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
          }
        };
        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        data-testid="chat-error"
        className="flex flex-col items-center p-4 mb-4 bg-red-100 border border-red-400 rounded-lg"
      >
        <p className="text-red-700 mb-3">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Importer
          </button>
        </div>
      </div>

      {/* Afficher l'état des connexions */}
      <ConnectionStatus />
    </div>
  );
}

export default ChatError;
