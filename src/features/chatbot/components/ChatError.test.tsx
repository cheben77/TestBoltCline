import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatError as ChatErrorComponent } from './ChatError';
import { createChatError, type ChatError } from '../hooks/useChatError';

describe('ChatError', () => {
  const mockError: ChatError = {
    name: 'ChatError',
    message: 'Une erreur est survenue',
    type: 'network',
    details: { status: 404 },
    timestamp: new Date()
  };

  afterEach(() => {
    cleanup();
  });

  it('affiche le message d\'erreur', () => {
    render(<ChatErrorComponent error={mockError} />);
    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
  });

  it('affiche le type d\'erreur', () => {
    render(<ChatErrorComponent error={mockError} />);
    expect(screen.getByText('Erreur network')).toBeInTheDocument();
  });

  it('affiche les détails techniques quand ils sont disponibles', () => {
    render(<ChatErrorComponent error={mockError} />);
    const detailsButton = screen.getByText('Détails techniques');
    fireEvent.click(detailsButton);
    expect(screen.getByText(/"status": 404/)).toBeInTheDocument();
  });

  it('appelle onRetry quand le bouton est cliqué', () => {
    const onRetry = jest.fn();
    render(<ChatErrorComponent error={mockError} onRetry={onRetry} />);
    const retryButton = screen.getByText('Réessayer');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('appelle onDismiss quand le bouton est cliqué', () => {
    const onDismiss = jest.fn();
    render(<ChatErrorComponent error={mockError} onDismiss={onDismiss} />);
    const dismissButton = screen.getByText('Fermer');
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('n\'affiche pas les boutons si les handlers ne sont pas fournis', () => {
    render(<ChatErrorComponent error={mockError} />);
    expect(screen.queryByText('Réessayer')).not.toBeInTheDocument();
    expect(screen.queryByText('Fermer')).not.toBeInTheDocument();
  });

  it('affiche l\'icône appropriée pour chaque type d\'erreur', () => {
    const errorTypes = ['network', 'notion', 'ollama', 'file', 'unknown'] as const;
    
    errorTypes.forEach(type => {
      const error: ChatError = {
        name: 'ChatError',
        message: 'Test error',
        type,
        timestamp: new Date()
      };
      
      const { container } = render(
        <ChatErrorComponent error={error} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      cleanup();
    });
  });

  it('applique la classe personnalisée', () => {
    const { container } = render(
      <ChatErrorComponent error={mockError} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('est accessible avec ARIA', () => {
    render(<ChatErrorComponent error={mockError} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
