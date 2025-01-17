import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionStatus } from './ConnectionStatus';
import { useChatConnection } from '../hooks/useChatConnection';

jest.mock('../hooks/useChatConnection');

describe('ConnectionStatus', () => {
  const mockUseChatConnection = useChatConnection as jest.Mock;

  beforeEach(() => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });
  });

  it('renders ollama status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: true,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="ollama" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders notion status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: true,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="notion" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders cuda status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: true,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="cuda" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders vscode status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: true,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="vscode" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders internet status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: true,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="internet" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders spotify status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: true,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="spotify" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders google status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: true,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="google" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders youtube status correctly', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: false,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: true,
    });

    render(<ConnectionStatus service="youtube" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('renders disconnected status correctly', () => {
    render(<ConnectionStatus service="ollama" />);
    expect(screen.getByText('Non connecté')).toBeInTheDocument();
  });

  it('renders with correct styles when connected', () => {
    mockUseChatConnection.mockReturnValue({
      ollamaStatus: true,
      notionStatus: false,
      cudaStatus: false,
      vscodeStatus: false,
      internetStatus: false,
      spotifyStatus: false,
      googleStatus: false,
      youtubeStatus: false,
    });

    render(<ConnectionStatus service="ollama" />);
    const container = screen.getByText('Connecté').parentElement;
    expect(container).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders with correct styles when disconnected', () => {
    render(<ConnectionStatus service="ollama" />);
    const container = screen.getByText('Non connecté').parentElement;
    expect(container).toHaveClass('bg-red-100', 'text-red-800');
  });
});
