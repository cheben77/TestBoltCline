import { renderHook, act } from '@testing-library/react';
import { useChatConnection } from './useChatConnection';

describe('useChatConnection', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialise avec tous les services déconnectés', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useChatConnection());

    // Attendre que le useEffect initial soit exécuté
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
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
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/ollama');
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/notion');
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/connect/cuda');
  });

  it('met à jour le statut quand la connexion réussit', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections();
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);
    expect(result.current.notionStatus.isConnected).toBe(true);
    expect(result.current.cudaStatus.isConnected).toBe(true);
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
  });
});
