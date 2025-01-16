import { renderHook, act } from '@testing-library/react';
import { useChatConnection } from './useChatConnection';

describe('useChatConnection', () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    global.fetch = jest.fn();
  });

  it('initialise les états correctement', () => {
    const { result } = renderHook(() => useChatConnection());

    expect(result.current.ollamaStatus).toEqual({
      isConnected: false,
      isLoading: true,
      error: null
    });
    expect(result.current.notionStatus).toEqual({
      isConnected: false,
      isLoading: true,
      error: null
    });
    expect(result.current.cudaStatus).toEqual({
      isConnected: false,
      isLoading: true,
      error: null
    });
  });

  it('vérifie toutes les connexions au chargement', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ available: true })
      });

    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
    expect(result.current.notionStatus.isConnected).toBe(true);
    expect(result.current.cudaStatus.isConnected).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('gère les erreurs de connexion', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Erreur Ollama'))
      .mockRejectedValueOnce(new Error('Erreur Notion'))
      .mockRejectedValueOnce(new Error('Erreur CUDA'));

    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.ollamaStatus.isConnected).toBe(false);
    expect(result.current.ollamaStatus.error).toBe('Erreur Ollama');
    expect(result.current.notionStatus.isConnected).toBe(false);
    expect(result.current.notionStatus.error).toBe('Erreur Notion');
    expect(result.current.cudaStatus.isConnected).toBe(false);
    expect(result.current.cudaStatus.error).toBe('Erreur CUDA');
  });

  it('permet de rafraîchir les connexions', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ available: true })
      });

    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections();
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
    expect(result.current.notionStatus.isConnected).toBe(true);
    expect(result.current.cudaStatus.isConnected).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
