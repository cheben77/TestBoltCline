import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Chatbot } from './Chatbot';
import { useChatbot } from '../hooks/useChatbot';

// Mock du hook useChatbot
jest.mock('../hooks/useChatbot');
const mockUseChatbot = useChatbot as jest.MockedFunction<typeof useChatbot>;

describe('Chatbot', () => {
  const defaultProps = {
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: jest.fn(),
    clearChat: jest.fn(),
    clearError: jest.fn()
  };

  beforeEach(() => {
    mockUseChatbot.mockReturnValue(defaultProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le bouton du chatbot', () => {
    render(<Chatbot />);
    expect(screen.getByTitle('Assistant StoaViva')).toBeInTheDocument();
  });

  it('n\'affiche pas la fenêtre de chat par défaut', () => {
    render(<Chatbot />);
    expect(screen.queryByPlaceholderText('Posez une question...')).not.toBeInTheDocument();
  });

  it('ouvre la fenêtre de chat au clic sur le bouton', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    expect(screen.getByPlaceholderText('Posez une question...')).toBeInTheDocument();
  });

  it('ferme la fenêtre de chat au second clic sur le bouton', () => {
    render(<Chatbot />);
    const button = screen.getByTitle('Assistant StoaViva');
    
    fireEvent.click(button);
    expect(screen.getByPlaceholderText('Posez une question...')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.queryByPlaceholderText('Posez une question...')).not.toBeInTheDocument();
  });

  it('affiche les messages de la conversation', () => {
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      messages: [
        { role: 'user', content: 'Bonjour' },
        { role: 'assistant', content: 'Comment puis-je vous aider ?' }
      ]
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    expect(screen.getByText('Bonjour')).toBeInTheDocument();
    expect(screen.getByText('Comment puis-je vous aider ?')).toBeInTheDocument();
  });

  it('envoie un message quand le formulaire est soumis', async () => {
    const sendMessage = jest.fn();
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      sendMessage
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    const input = screen.getByPlaceholderText('Posez une question...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(sendMessage).toHaveBeenCalledWith('Test message', { type: 'notion' });
    expect(input).toHaveValue('');
  });

  it('affiche l\'indicateur de chargement', () => {
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      isLoading: true
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    const loadingDots = screen.getAllByRole('presentation');
    expect(loadingDots).toHaveLength(3);
  });

  it('affiche les erreurs', () => {
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      error: 'Une erreur est survenue'
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
  });

  it('efface la conversation au clic sur le bouton effacer', () => {
    const clearChat = jest.fn();
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      clearChat
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));
    fireEvent.click(screen.getByTitle('Effacer la conversation'));

    expect(clearChat).toHaveBeenCalled();
  });

  it('désactive le bouton d\'envoi quand le champ est vide', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    expect(submitButton).toBeDisabled();
  });

  it('désactive le champ de saisie pendant le chargement', () => {
    mockUseChatbot.mockReturnValue({
      ...defaultProps,
      isLoading: true
    });

    render(<Chatbot />);
    fireEvent.click(screen.getByTitle('Assistant StoaViva'));

    const input = screen.getByPlaceholderText('Posez une question...');
    expect(input).toBeDisabled();
  });
});
