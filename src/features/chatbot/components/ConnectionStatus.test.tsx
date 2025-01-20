import React from 'react';
<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
=======
import { render, screen } from '@testing-library/react';
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
import { ConnectionStatus } from './ConnectionStatus';
import { useChatConnection } from '../hooks/useChatConnection';

// Mock du hook useChatConnection
jest.mock('../hooks/useChatConnection');

describe('ConnectionStatus', () => {
<<<<<<< HEAD
  const mockCheckConnections = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
=======
  beforeEach(() => {
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
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
<<<<<<< HEAD
      },
      checkConnections: mockCheckConnections
    });
  });

  it('affiche les trois services', () => {
    render(<ConnectionStatus />);
    
=======
      }
    });
  });

  it('affiche le titre', () => {
    render(<ConnectionStatus />);
    expect(screen.getByText('État des connexions')).toBeInTheDocument();
  });

  it('affiche les noms des services', () => {
    render(<ConnectionStatus />);
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('CUDA')).toBeInTheDocument();
  });

<<<<<<< HEAD
  it('affiche les états de connexion corrects', () => {
=======
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
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
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
<<<<<<< HEAD
        error: 'CUDA non disponible'
      },
      checkConnections: mockCheckConnections
    });

    render(<ConnectionStatus />);

    // Ollama connecté (vert)
    const ollamaToggle = screen.getByTitle('Connecté');
    expect(ollamaToggle).toHaveClass('bg-green-500');

    // Notion en chargement
    const notionLoading = screen.getByTestId('notion-loading');
    expect(notionLoading).toHaveClass('animate-pulse');

    // CUDA avec erreur
    const cudaError = screen.getByTitle('CUDA non disponible');
    expect(cudaError).toBeInTheDocument();
  });

  it('appelle checkConnections au clic sur le bouton rafraîchir', async () => {
    render(<ConnectionStatus />);
    
    fireEvent.click(screen.getByText('Rafraîchir'));
    
    expect(mockCheckConnections).toHaveBeenCalledTimes(1);
  });

  it('appelle checkConnections au clic sur un indicateur', async () => {
    render(<ConnectionStatus />);
    
    const toggles = screen.getAllByRole('button');
    fireEvent.click(toggles[0]); // Premier toggle (Ollama)
    
    expect(mockCheckConnections).toHaveBeenCalledTimes(1);
  });

  it('affiche les tooltips avec les messages d\'erreur', () => {
    const errorMessage = 'Erreur de connexion';
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: false,
        isLoading: false,
        error: errorMessage
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
      checkConnections: mockCheckConnections
    });

    render(<ConnectionStatus />);
    
    expect(screen.getByTitle(errorMessage)).toBeInTheDocument();
  });

  it('désactive les interactions pendant le chargement', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: {
        isConnected: false,
        isLoading: true,
        error: null
      },
      notionStatus: {
        isConnected: false,
        isLoading: true,
        error: null
      },
      cudaStatus: {
        isConnected: false,
        isLoading: true,
        error: null
      },
      checkConnections: mockCheckConnections
    });

    render(<ConnectionStatus />);
    
    const refreshButton = screen.getByText('Rafraîchir');
    expect(refreshButton).toBeDisabled();
=======
        error: new Error('Test error')
      }
    });

    const { container } = render(<ConnectionStatus />);
    
    const indicators = container.querySelectorAll('.rounded-full');
    expect(indicators[0]).toHaveClass('bg-green-500'); // Connecté
    expect(indicators[1]).toHaveClass('bg-yellow-500'); // En cours
    expect(indicators[2]).toHaveClass('bg-red-500'); // Erreur
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  });
});
