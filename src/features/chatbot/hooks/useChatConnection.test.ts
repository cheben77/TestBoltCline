import { renderHook, act } from '@testing-library/react';
import { useChatConnection } from './useChatConnection';

describe('useChatConnection', () => {
  beforeEach(() => {
<<<<<<< HEAD
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

=======
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialise avec tous les services déconnectés', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useChatConnection());

    // Attendre que le useEffect initial soit exécuté
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
<<<<<<< HEAD
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

=======
    expect(result.current.ollamaStatus.isLoading).toBe(false);
    expect(result.current.ollamaStatus.error).toBe(null);

    expect(result.current.notionStatus.isConnected).toBe(true);
    expect(result.current.notionStatus.isLoading).toBe(false);
    expect(result.current.notionStatus.error).toBe(null);

    expect(result.current.cudaStatus.isConnected).toBe(true);
    expect(result.current.cudaStatus.isLoading).toBe(false);
    expect(result.current.cudaStatus.error).toBe(null);
  });

  it('vérifie les connexions au montage', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    renderHook(() => useChatConnection());

    // Attendre que tous les appels fetch soient effectués
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

<<<<<<< HEAD
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

=======
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/ollama');
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/notion');
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/cuda');
  });

  it('met à jour le statut quand la connexion réussit', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections();
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
    expect(result.current.notionStatus.isConnected).toBe(true);
    expect(result.current.cudaStatus.isConnected).toBe(true);
<<<<<<< HEAD
    expect(global.fetch).toHaveBeenCalledTimes(3);
=======
  });

  it('gère les erreurs de connexion', async () => {
    const error = new Error('Connection failed');
    (global.fetch as jest.Mock).mockRejectedValue(error);
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections();
    });

    expect(result.current.ollamaStatus.error).toBeTruthy();
    expect(result.current.notionStatus.error).toBeTruthy();
    expect(result.current.cudaStatus.error).toBeTruthy();
  });

  it('gère les réponses HTTP non-ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections();
    });

    expect(result.current.ollamaStatus.error?.message).toContain('500');
    expect(result.current.notionStatus.error?.message).toContain('500');
    expect(result.current.cudaStatus.error?.message).toContain('500');
  });

  it('met à jour isLoading pendant la vérification', async () => {
    let resolveOllama: (value: { ok: boolean }) => void;
    const ollamaPromise = new Promise<{ ok: boolean }>(resolve => {
      resolveOllama = resolve;
    });

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('ollama')) {
        return ollamaPromise;
      }
      return Promise.resolve({ ok: true });
    });

    const { result } = renderHook(() => useChatConnection());

    // Attendre que le useEffect initial soit exécuté
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Lancer la vérification manuelle
    await act(async () => {
      const checkPromise = result.current.checkConnections();
      expect(result.current.ollamaStatus.isLoading).toBe(true);
      resolveOllama!({ ok: true });
      await checkPromise;
    });

    expect(result.current.ollamaStatus.isLoading).toBe(false);
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  });
});
