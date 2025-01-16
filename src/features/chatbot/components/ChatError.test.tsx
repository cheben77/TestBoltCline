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
  const mockCheckConnections = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    // Mock du hook useChatError
    (useChatError as jest.Mock).mockReturnValue({
      clearError: mockClearError
    });

    // Mock du hook useChatConnection
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

  it('a un bouton d\'import fonctionnel', () => {
    render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    const importButton = screen.getByRole('button', { name: /importer/i });
    expect(importButton).toBeInTheDocument();
    expect(importButton).toHaveClass('bg-blue-500');
  });

  it('affiche le composant ConnectionStatus', () => {
    const { container } = render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    const connectionStatus = container.querySelector('.space-y-4');
    expect(connectionStatus).toBeInTheDocument();
  });

  it('applique les styles appropriés', () => {
    const { container } = render(<ChatError message={mockMessage} onRetry={mockOnRetry} />);
    const errorContainer = container.querySelector('[data-testid="chat-error"]');
    expect(errorContainer).toHaveClass('bg-red-100');
    expect(errorContainer).toHaveClass('border-red-400');
  });
});
