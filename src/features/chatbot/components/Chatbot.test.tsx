import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chatbot from './Chatbot';

// Mock des composants externes
jest.mock('@/components/Canvas', () => {
  return function MockCanvas({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="mock-canvas">
        <button onClick={onClose}>Fermer</button>
      </div>
    );
  };
});

// Mock de fetch pour les appels API
global.fetch = jest.fn();

describe('Chatbot', () => {
  beforeEach(() => {
    // Reset des mocks
    (global.fetch as jest.Mock).mockReset();
    
    // Mock par défaut pour le chargement des modèles
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/ollama/models') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ models: ['codestral:latest'] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: 'Réponse test' })
      });
    });
  });

  it('affiche le bouton du chatbot', () => {
    render(<Chatbot />);
    expect(screen.getByTitle('Assistant StoaViva')).toBeInTheDocument();
  });

  it('ouvre et ferme le chatbot', () => {
    render(<Chatbot />);
    const button = screen.getByTitle('Assistant StoaViva');
    
    // Ouvrir
    fireEvent.click(button);
    expect(screen.getByPlaceholderText(/Posez une question/)).toBeInTheDocument();
    
    // Fermer
    fireEvent.click(button);
    expect(screen.queryByPlaceholderText(/Posez une question/)).not.toBeInTheDocument();
  });

  it('envoie un message et reçoit une réponse', async () => {
    render(<Chatbot />);
    
    // Ouvrir le chatbot
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    
    // Entrer et envoyer un message
    const input = screen.getByPlaceholderText(/Posez une question/);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(screen.getByRole('button', { name: /Envoyer/i }));
    
    // Vérifier que le message est envoyé
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    // Attendre et vérifier la réponse
    await waitFor(() => {
      expect(screen.getByText('Réponse test')).toBeInTheDocument();
    });
  });

  it('gère les erreurs de l\'API', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    );

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    
    const input = screen.getByPlaceholderText(/Posez une question/);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(screen.getByRole('button', { name: /Envoyer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Désolé, une erreur est survenue/)).toBeInTheDocument();
    });
  });

  it('change de mode correctement', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    
    const modeSelect = screen.getByRole('combobox');
    fireEvent.change(modeSelect, { target: { value: 'file' } });
    
    expect(screen.getByText(/Fichier sélectionné/)).toBeInTheDocument();
  });

  it('ouvre le canevas avec le dernier message du bot', async () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    
    // Simuler une conversation
    const input = screen.getByPlaceholderText(/Posez une question/);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(screen.getByRole('button', { name: /Envoyer/i }));
    
    // Attendre la réponse
    await waitFor(() => {
      expect(screen.getByText('Réponse test')).toBeInTheDocument();
    });
    
    // Ouvrir le canevas
    const canvasButton = screen.getByRole('button', { name: /Ouvrir dans le canevas/i });
    fireEvent.click(canvasButton);
    
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });
});
