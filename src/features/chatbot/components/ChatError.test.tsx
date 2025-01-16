import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatError } from './ChatError';

describe('ChatError', () => {
  const defaultMessage = 'Une erreur est survenue';

  it('affiche le message d\'erreur', () => {
    render(<ChatError message={defaultMessage} />);
    expect(screen.getByText(defaultMessage)).toBeInTheDocument();
  });

  it('n\'affiche pas le bouton réessayer si onRetry n\'est pas fourni', () => {
    render(<ChatError message={defaultMessage} />);
    expect(screen.queryByText('Réessayer')).not.toBeInTheDocument();
  });

  it('n\'affiche pas le bouton fermer si onDismiss n\'est pas fourni', () => {
    render(<ChatError message={defaultMessage} />);
    expect(screen.queryByText('Fermer')).not.toBeInTheDocument();
  });

  it('affiche le bouton réessayer si onRetry est fourni', () => {
    render(<ChatError message={defaultMessage} onRetry={() => {}} />);
    expect(screen.getByText('Réessayer')).toBeInTheDocument();
  });

  it('appelle onRetry quand le bouton réessayer est cliqué', () => {
    const onRetry = jest.fn();
    render(<ChatError message={defaultMessage} onRetry={onRetry} />);
    
    fireEvent.click(screen.getByText('Réessayer'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('appelle onDismiss quand le bouton fermer est cliqué', () => {
    const onDismiss = jest.fn();
    render(<ChatError message={defaultMessage} onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByText('Fermer'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('affiche l\'icône d\'erreur', () => {
    render(<ChatError message={defaultMessage} />);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('applique les styles d\'erreur', () => {
    render(<ChatError message={defaultMessage} />);
    const container = screen.getByText(defaultMessage).closest('.bg-red-100');
    expect(container).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('gère les messages longs correctement', () => {
    const longMessage = 'a'.repeat(100);
    render(<ChatError message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('gère les messages avec des caractères spéciaux', () => {
    const specialMessage = '!@#$%^&*()_+';
    render(<ChatError message={specialMessage} />);
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });
});
