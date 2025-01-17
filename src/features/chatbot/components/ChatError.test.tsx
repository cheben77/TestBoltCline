import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatError from './ChatError';
import { useChatError } from '../hooks/useChatError';

// Mock du hook useChatError
jest.mock('../hooks/useChatError', () => ({
  useChatError: jest.fn()
}));

// Mock de fetch pour les tests d'importation
global.fetch = jest.fn();

describe('ChatError', () => {
  const mockClearError = jest.fn();
  const mockOnRetry = jest.fn();
  const defaultProps = {
    message: 'Test error message',
    onRetry: mockOnRetry
  };

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    
    // Configuration par défaut du mock useChatError
    (useChatError as jest.Mock).mockReturnValue({
      clearError: mockClearError
    });

    // Configuration par défaut du mock fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true
    });
  });

  it('rend le message d\'erreur', () => {
    render(<ChatError {...defaultProps} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('appelle clearError et onRetry lors du clic sur Réessayer', () => {
    render(<ChatError {...defaultProps} />);
    
    const retryButton = screen.getByText('Réessayer');
    fireEvent.click(retryButton);
    
    expect(mockClearError).toHaveBeenCalledTimes(1);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('affiche le bouton d\'importation', () => {
    render(<ChatError {...defaultProps} />);
    expect(screen.getByText('Importer')).toBeInTheDocument();
  });

  it('gère l\'importation de fichier JSON', async () => {
    render(<ChatError {...defaultProps} />);
    
    // Mock FileReader
    const mockFileReader = {
      onload: null as any,
      readAsText: jest.fn().mockImplementation(function(this: any) {
        setTimeout(() => {
          this.onload({ target: { result: '{"test": "data"}' } });
        }, 0);
      })
    };
    (window as any).FileReader = jest.fn(() => mockFileReader);

    // Mock input file
    const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const input = document.createElement('input');
    jest.spyOn(document, 'createElement').mockReturnValue(input);
    
    // Clic sur le bouton d'importation
    const importButton = screen.getByText('Importer');
    fireEvent.click(importButton);

    // Simuler la sélection de fichier
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"test":"data"}'
      });
    });

    expect(mockClearError).toHaveBeenCalled();
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('gère les erreurs d\'importation', async () => {
    // Mock console.error pour éviter les logs dans les tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Import failed'));
    
    render(<ChatError {...defaultProps} />);
    
    const mockFileReader = {
      onload: null as any,
      readAsText: jest.fn().mockImplementation(function(this: any) {
        setTimeout(() => {
          this.onload({ target: { result: '{"test": "data"}' } });
        }, 0);
      })
    };
    (window as any).FileReader = jest.fn(() => mockFileReader);

    const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const input = document.createElement('input');
    jest.spyOn(document, 'createElement').mockReturnValue(input);
    
    const importButton = screen.getByText('Importer');
    fireEvent.click(importButton);
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erreur lors de l\'importation:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('applique les styles corrects aux boutons', () => {
    render(<ChatError {...defaultProps} />);
    
    const retryButton = screen.getByText('Réessayer');
    const importButton = screen.getByText('Importer');
    
    expect(retryButton).toHaveClass(
      'bg-red-500',
      'text-white',
      'rounded',
      'hover:bg-red-600'
    );
    
    expect(importButton).toHaveClass(
      'bg-blue-500',
      'text-white',
      'rounded',
      'hover:bg-blue-600'
    );
  });

  it('rend le composant ConnectionStatus', () => {
    render(<ChatError {...defaultProps} />);
    expect(screen.getByTestId('chat-error')).toBeInTheDocument();
  });
});
