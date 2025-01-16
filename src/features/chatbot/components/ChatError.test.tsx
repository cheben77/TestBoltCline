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

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatError as jest.Mock).mockReturnValue({
      clearError: mockClearError
    });
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
  });

  it('applique les styles appropriés', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    const errorContainer = screen.getByTestId('chat-error');
    expect(errorContainer).toHaveClass('bg-red-100', 'border-red-400');
  });
});
