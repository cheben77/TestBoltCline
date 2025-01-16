import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from './Chatbot';

// Mock des dépendances
jest.mock('./Canvas', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="mock-canvas">
      <button onClick={onClose}>Close Canvas</button>
    </div>
  ),
}));

jest.mock('./FileUploadProgress', () => ({
  __esModule: true,
  default: ({ filename, progress }: { filename: string; progress: number }) => (
    <div data-testid="mock-upload-progress">
      {filename}: {progress}%
    </div>
  ),
}));

jest.mock('@/services/notion', () => ({
  notionService: {
    getContextForQuery: jest.fn(),
    getProducts: jest.fn(),
    getServices: jest.fn(),
    getPersons: jest.fn(),
    getCalendarEvents: jest.fn(),
    getEcologicalImpact: jest.fn(),
    getDatabaseSchema: jest.fn(),
    getDatabases: jest.fn(),
    createCalendarEvent: jest.fn(),
    updateCalendarEvent: jest.fn(),
    deleteCalendarEvent: jest.fn(),
    createDatabase: jest.fn(),
    addDatabaseProperty: jest.fn(),
    removeDatabaseProperty: jest.fn(),
  },
}));

describe('Chatbot', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
    
    // Mock de fetch pour les appels API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'connected', models: ['model1', 'model2'] }),
      })
    ) as jest.Mock;
  });

  it('rend le composant avec le bouton flottant', () => {
    render(<Chatbot />);
    expect(screen.getByTitle(/assistant stoaviva/i)).toBeInTheDocument();
  });

  it('ouvre la fenêtre de chat au clic sur le bouton', () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    expect(screen.getByText(/assistant stoaviva/i)).toBeInTheDocument();
  });

  it('affiche le message de bienvenue initial', () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    expect(screen.getByText(/bonjour.*je suis l'assistant stoaviva/i)).toBeInTheDocument();
  });

  it('permet de changer de mode', () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    
    // Change to Notion mode
    const notionButton = screen.getByTitle('Chat avec Notion');
    fireEvent.click(notionButton);
    expect(screen.getByText(/mode chat notion activé/i)).toBeInTheDocument();
  });

  it('permet d\'envoyer un message', async () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    
    const input = screen.getByPlaceholderText(/posez votre question/i);
    const submitButton = screen.getByText(/envoyer/i);
    
    fireEvent.change(input, { target: { value: 'Bonjour' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bonjour')).toBeInTheDocument();
    });
  });

  it('vérifie le statut de Notion au chargement', async () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/notion connecté/i)).toBeInTheDocument();
    });
  });

  it('charge les modèles Ollama au démarrage', async () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('model1');
    });
  });

  it('permet d\'ouvrir et fermer le canevas', () => {
    render(<Chatbot />);
    const button = screen.getByTitle(/assistant stoaviva/i);
    fireEvent.click(button);
    
    const canvasButton = screen.getByTitle('Canevas');
    fireEvent.click(canvasButton);
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Close Canvas');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('mock-canvas')).not.toBeInTheDocument();
  });
});
