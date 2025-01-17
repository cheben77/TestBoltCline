import { useState, useEffect } from 'react';
import { Workflow } from '../lib/triggers';

interface VSCodeSyncState {
  isConnected: boolean;
  error: string | null;
}

export const useVSCodeSync = (workflow: Workflow | null, onWorkflowUpdate?: (workflow: Workflow) => void) => {
  const [state, setState] = useState<VSCodeSyncState>({
    isConnected: false,
    error: null
  });

  // Vérifier la connexion VSCode
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/chat/connect/vscode');
        const data = await response.json();
        setState(prev => ({
          ...prev,
          isConnected: data.status === 'connected',
          error: data.status === 'connected' ? null : data.error
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: 'Erreur de connexion à VSCode'
        }));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  // Synchroniser le workflow avec VSCode
  const syncToVSCode = async () => {
    if (!workflow) return;

    try {
      const response = await fetch('/api/chat/connect/vscode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: JSON.stringify(workflow, null, 2),
          language: 'json'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation avec VSCode');
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.message);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur de synchronisation'
      }));
    }
  };

  // Écouter les mises à jour de VSCode
  useEffect(() => {
    if (!state.isConnected) return;

    const listenToVSCodeChanges = async () => {
      try {
        const response = await fetch('/api/chat/connect/vscode/watch');
        const data = await response.json();
        
        if (data.status === 'updated' && data.workflow && onWorkflowUpdate) {
          onWorkflowUpdate(data.workflow);
        }
      } catch (error) {
        console.error('Erreur lors de l\'écoute des changements VSCode:', error);
      }
    };

    const interval = setInterval(listenToVSCodeChanges, 1000);
    return () => clearInterval(interval);
  }, [state.isConnected, onWorkflowUpdate]);

  return {
    ...state,
    syncToVSCode
  };
};
