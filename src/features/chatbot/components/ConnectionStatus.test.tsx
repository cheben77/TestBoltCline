import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionStatus } from './ConnectionStatus';
import { useChatConnection } from '../hooks/useChatConnection';

// Mock du hook useChatConnection
jest.mock('../hooks/useChatConnection');

describe('ConnectionStatus', () => {
  beforeEach(() => {
    (useChatConnection as jest.Mock).mockReturnValue({
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
    });
  });

  it('affiche le titre', () => {
    render(<ConnectionStatus />);
    expect(screen.getByText('État des connexions')).toBeInTheDocument();
  });

  it('affiche les noms des services', () => {
    render(<ConnectionStatus />);
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('CUDA')).toBeInTheDocument();
  });

  it('affiche le statut connecté', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: true,
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
    });

    render(<ConnectionStatus />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
    expect(screen.getAllByText('Déconnecté')).toHaveLength(2);
  });

  it('affiche le statut en cours de connexion', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: false,
        isLoading: true,
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
    });

    render(<ConnectionStatus />);
    expect(screen.getByText('Connexion...')).toBeInTheDocument();
  });

  it('affiche le statut d\'erreur', () => {
    const error = new Error('Test error');
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: false,
        isLoading: false,
        error
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
    });

    render(<ConnectionStatus />);
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByTitle('Test error')).toBeInTheDocument();
  });

  it('applique les bonnes classes de couleur', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: true,
        isLoading: false,
        error: null
      },
      notionStatus: {
        isConnected: false,
        isLoading: true,
        error: null
      },
      cudaStatus: {
        isConnected: false,
        isLoading: false,
        error: new Error('Test error')
      }
    });

    const { container } = render(<ConnectionStatus />);
    
    const indicators = container.querySelectorAll('.rounded-full');
    expect(indicators[0]).toHaveClass('bg-green-500'); // Connecté
    expect(indicators[1]).toHaveClass('bg-yellow-500'); // En cours
    expect(indicators[2]).toHaveClass('bg-red-500'); // Erreur
  });
});
