import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectionStatus } from './ConnectionStatus';
import { useChatConnection } from '../hooks/useChatConnection';

// Mock du hook useChatConnection
jest.mock('../hooks/useChatConnection');

describe('ConnectionStatus', () => {
  const mockCheckConnections = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
      },
      checkConnections: mockCheckConnections
    });
  });

  it('affiche les trois services', () => {
    render(<ConnectionStatus />);
    
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('CUDA')).toBeInTheDocument();
  });

  it('affiche les états de connexion corrects', () => {
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
  });
});
