import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatError } from './ChatError';
import { useChatError } from '../hooks/useChatError';
import { useChatConnection } from '../hooks/useChatConnection';

// Mock des hooks
jest.mock('../hooks/useChatError');
jest.mock('../hooks/useChatConnection');

describe('ChatError', () => {
  const mockMessage = 'Une erreur est survenue';
  const mockOnRetry = jest.fn();
  const mockClearError = jest.fn();
<<<<<<< HEAD
  const mockCheckConnections = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    // Mock du hook useChatError
    (useChatError as jest.Mock).mockReturnValue({
      clearError: mockClearError
    });

    // Mock du hook useChatConnection
=======

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatError as jest.Mock).mockReturnValue({
      clearError: mockClearError
    });
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
=======
      }
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    });
  });

  it('affiche le message d\'erreur', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it('affiche les boutons d\'action', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /importer/i })).toBeInTheDocument();
  });

  it('appelle clearError et onRetry quand le bouton réessayer est cliqué', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));
    expect(mockClearError).toHaveBeenCalledTimes(1);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

<<<<<<< HEAD
  it('gère l\'importation de fichier', async () => {
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    // Simuler la sélection de fichier
    fireEvent.click(screen.getByRole('button', { name: /importer/i }));
    fireEvent.change(input, { target: { files: [file] } });

    // Vérifier que le fetch a été appelé avec les bons paramètres
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/import', expect.any(Object));
  });

  it('affiche le composant ConnectionStatus', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    expect(screen.getByText('État des connexions')).toBeInTheDocument();
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('CUDA')).toBeInTheDocument();
=======
  it('gère l\'importation de fichier', () => {
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    
    // Simuler le clic sur le bouton d'import
    fireEvent.click(screen.getByRole('button', { name: /importer/i }));

    // Vérifier que le bouton est présent et a le bon style
    const importButton = screen.getByRole('button', { name: /importer/i });
    expect(importButton).toHaveClass('bg-blue-500');
  });

  it('affiche le composant ConnectionStatus', () => {
    const { container } = render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    expect(container.querySelector('.space-y-4')).toBeInTheDocument();
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  });

  it('applique les styles appropriés', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    const errorContainer = screen.getByTestId('chat-error');
    expect(errorContainer).toHaveClass('bg-red-100', 'border-red-400');
  });
});
