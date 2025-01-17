import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatCanvas from './ChatCanvas';
import { TRIGGERS } from '../lib/triggers';

// Mock des dépendances
jest.mock('../lib/triggers', () => ({
  TRIGGERS: {
    'system-info': {
      id: 'system-info',
      name: 'System Info',
      description: 'Get system information',
      params: []
    }
  }
}));

describe('ChatCanvas', () => {
  const mockOnClose = jest.fn();
  const initialContent = 'Test content\n```javascript\nconst x = 1;\n```';

  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('affiche le contenu initial', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it('extrait automatiquement les blocs de code du contenu initial', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('permet de changer le langage sélectionné', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'python' } });
    expect(select).toHaveValue('python');
  });

  it('permet d\'extraire du code', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    const extractButton = screen.getByTitle('Extraire le code');
    fireEvent.click(extractButton);
    expect(screen.getAllByText(/test content/i)).toHaveLength(2); // Original + extrait
  });

  it('permet de créer une étape d\'automatisation', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    const createButton = screen.getByTitle('Créer une automatisation');
    fireEvent.click(createButton);
    expect(screen.getByText('Déclencheur')).toBeInTheDocument();
  });

  it('permet de générer du code à partir des étapes', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    // Créer une étape
    const createButton = screen.getByTitle('Créer une automatisation');
    fireEvent.click(createButton);
    
    // Générer le code
    const generateButton = screen.getByTitle('Générer du code');
    fireEvent.click(generateButton);
    
    expect(screen.getByText(/trigger:/i)).toBeInTheDocument();
  });

  it('permet de créer un workflow', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    // Créer une étape
    const createButton = screen.getByTitle('Créer une automatisation');
    fireEvent.click(createButton);
    
    // Créer le workflow
    const workflowButton = screen.getByTitle('Créer un workflow');
    fireEvent.click(workflowButton);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Workflow créé:',
      expect.objectContaining({
        name: 'Nouveau workflow',
        steps: expect.any(Object)
      })
    );
  });

  it('permet de supprimer un bloc de code', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    // Le bloc est extrait automatiquement
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('const x = 1;')).not.toBeInTheDocument();
  });

  it('permet de modifier la description d\'un bloc de code', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    const input = screen.getByPlaceholderText('Description du code');
    fireEvent.change(input, { target: { value: 'Ma description' } });
    
    expect(input).toHaveValue('Ma description');
  });

  it('permet de modifier le type d\'une étape d\'automatisation', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    // Créer une étape
    const createButton = screen.getByTitle('Créer une automatisation');
    fireEvent.click(createButton);
    
    // Changer le type
    const select = screen.getByRole('combobox', { name: '' });
    fireEvent.change(select, { target: { value: 'action' } });
    
    expect(select).toHaveValue('action');
  });

  it('permet de supprimer une étape d\'automatisation', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    // Créer une étape
    const createButton = screen.getByTitle('Créer une automatisation');
    fireEvent.click(createButton);
    
    // Supprimer l'étape
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('Déclencheur')).not.toBeInTheDocument();
  });

  it('se ferme quand on clique sur le bouton fermer', () => {
    render(<ChatCanvas onClose={mockOnClose} initialContent={initialContent} />);
    
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
