import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatConnections from './ChatConnections';
import { useChatConnection } from '@/features/chatbot/hooks/useChatConnection';

// Mock the hook
jest.mock('@/features/chatbot/hooks/useChatConnection');

describe('ChatConnections', () => {
  const mockCheckConnections = jest.fn();

  beforeEach(() => {
    (useChatConnection as jest.Mock).mockReturnValue({
      ollamaStatus: { isConnected: false, isLoading: false },
      notionStatus: { isConnected: true, isLoading: false },
      cudaStatus: { isConnected: false, isLoading: true },
      vscodeStatus: { isConnected: false, isLoading: false },
      internetStatus: { isConnected: true, isLoading: false },
      spotifyStatus: { isConnected: false, isLoading: false },
      googleStatus: { isConnected: true, isLoading: false },
      youtubeStatus: { isConnected: false, isLoading: false },
      checkConnections: mockCheckConnections
    });
  });

  it('rend tous les services de connexion', () => {
    render(<ChatConnections />);
    
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('CUDA')).toBeInTheDocument();
    expect(screen.getByText('VSCode')).toBeInTheDocument();
    expect(screen.getByText('Internet')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('affiche le statut correct pour chaque connexion', () => {
    render(<ChatConnections />);
    
    // Ollama - Non connecté
    expect(screen.getAllByText('Non connecté')[0]).toBeInTheDocument();
    
    // Notion - Connecté
    expect(screen.getAllByText('Connecté')[0]).toBeInTheDocument();
    
    // CUDA - En cours de connexion
    expect(screen.getByText('Connexion...')).toBeInTheDocument();
  });

  it('applique les styles corrects selon le statut', () => {
    render(<ChatConnections />);
    
    // Notion - Connecté (vert)
    const notionButton = screen.getByText('Notion').closest('button');
    expect(notionButton).toHaveClass('bg-green-100', 'text-green-800');
    
    // Ollama - Non connecté (gris)
    const ollamaButton = screen.getByText('Ollama').closest('button');
    expect(ollamaButton).toHaveClass('bg-gray-50', 'text-gray-700');
  });

  it('appelle checkConnections lors du clic sur un service', () => {
    render(<ChatConnections />);
    
    const ollamaButton = screen.getByText('Ollama').closest('button');
    if (ollamaButton) {
      fireEvent.click(ollamaButton);
    }
    
    expect(mockCheckConnections).toHaveBeenCalledWith(true);
  });

  it('désactive le bouton pendant le chargement', () => {
    render(<ChatConnections />);
    
    const cudaButton = screen.getByText('CUDA').closest('button');
    expect(cudaButton).toHaveAttribute('disabled');
  });

  it('affiche une icône de chargement pour les services en cours de connexion', () => {
    render(<ChatConnections />);
    
    const loadingIndicator = screen.getByText('CUDA')
      .closest('button')
      ?.querySelector('.animate-ping');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('affiche le texte d\'aide', () => {
    render(<ChatConnections />);
    
    expect(screen.getByText(/cliquez sur un service pour le connecter ou le déconnecter/i)).toBeInTheDocument();
    expect(screen.getByText(/les services connectés vous permettent d'accéder à des fonctionnalités supplémentaires/i)).toBeInTheDocument();
  });

  it('affiche les icônes appropriées pour chaque service', () => {
    render(<ChatConnections />);
    
    // Vérifier que chaque service a une icône
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
