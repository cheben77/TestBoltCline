import { renderHook, act } from '@testing-library/react';
import { useChatConnection, ServiceStatus } from './useChatConnection';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

type ServiceKey = keyof ReturnType<typeof useChatConnection>;
const serviceKeys: (keyof Omit<ReturnType<typeof useChatConnection>, 'checkConnections'>)[] = [
  'ollamaStatus',
  'notionStatus',
  'cudaStatus',
  'vscodeStatus',
  'internetStatus',
  'spotifyStatus',
  'googleStatus',
  'youtubeStatus'
];

describe('useChatConnection', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'connected' })
      })
    );
  });

  it('initialise avec les états par défaut', () => {
    const { result } = renderHook(() => useChatConnection());

    serviceKeys.forEach(service => {
      expect(result.current[service]).toEqual({
        isConnected: false,
        isLoading: false,
        error: null
      });
    });
  });

  it('vérifie les connexions au montage', async () => {
    renderHook(() => useChatConnection());

    const expectedUrls = [
      '/api/chat/connect/ollama',
      '/api/chat/connect/notion',
      '/api/chat/connect/cuda',
      '/api/chat/connect/vscode',
      '/api/chat/connect/internet',
      '/api/chat/connect/spotify',
      '/api/chat/connect/google',
      '/api/chat/connect/youtube'
    ];

    expectedUrls.forEach(url => {
      expect(mockFetch).toHaveBeenCalledWith(url);
    });
  });

  it('met à jour le statut lors d\'une connexion réussie', async () => {
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections(true);
    });

    serviceKeys.forEach(service => {
      expect(result.current[service].isConnected).toBe(true);
      expect(result.current[service].isLoading).toBe(false);
      expect(result.current[service].error).toBeNull();
    });
  });

  it('gère les erreurs de connexion', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Connection failed'))
    );

    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections(true);
    });

    expect(result.current.ollamaStatus.isConnected).toBe(false);
    expect(result.current.ollamaStatus.error).toEqual(new Error('Connection failed'));
  });

  it('gère les réponses d\'erreur HTTP', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections(true);
    });

    expect(result.current.ollamaStatus.isConnected).toBe(false);
    expect(result.current.ollamaStatus.error).toEqual(new Error('HTTP error! status: 500'));
  });

  it('met à jour l\'état de chargement pendant la vérification', async () => {
    const { result } = renderHook(() => useChatConnection());

    let promise: Promise<void>;
    act(() => {
      promise = result.current.checkConnections(true);
    });

    serviceKeys.forEach(service => {
      expect(result.current[service].isLoading).toBe(true);
    });

    await act(async () => {
      await promise;
    });

    serviceKeys.forEach(service => {
      expect(result.current[service].isLoading).toBe(false);
    });
  });

  it('vérifie toutes les connexions simultanément', async () => {
    const { result } = renderHook(() => useChatConnection());

    await act(async () => {
      await result.current.checkConnections(true);
    });

    const expectedUrls = [
      '/api/chat/connect/ollama',
      '/api/chat/connect/notion',
      '/api/chat/connect/cuda',
      '/api/chat/connect/vscode',
      '/api/chat/connect/internet',
      '/api/chat/connect/spotify',
      '/api/chat/connect/google',
      '/api/chat/connect/youtube'
    ];

    const calls = mockFetch.mock.calls.map(call => call[0]);
    expectedUrls.forEach(url => {
      expect(calls).toContain(url);
    });
  });

  it('conserve l\'état précédent en cas d\'erreur', async () => {
    const { result } = renderHook(() => useChatConnection());

    // Première connexion réussie
    await act(async () => {
      await result.current.checkConnections(true);
    });

    const initialState = result.current.ollamaStatus.isConnected;

    // Deuxième connexion échoue
    mockFetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Connection failed'))
    );

    await act(async () => {
      await result.current.checkConnections(true);
    });

    expect(result.current.ollamaStatus.isConnected).toBe(initialState);
  });

  it('gère les timeouts de connexion', async () => {
    jest.useFakeTimers();
    mockFetch.mockImplementationOnce(() => 
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ status: 'connected' })
          });
        }, 10000);
      })
    );

    const { result } = renderHook(() => useChatConnection());

    const checkPromise = result.current.checkConnections(true);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.ollamaStatus.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await act(async () => {
      await checkPromise;
    });

    expect(result.current.ollamaStatus.error).toBeDefined();
    
    jest.useRealTimers();
  });

  it('gère la connexion et la déconnexion', async () => {
    const { result } = renderHook(() => useChatConnection());

    // Test de connexion
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'connected' })
      })
    );

    await act(async () => {
      await result.current.checkConnections(true);
    });

    expect(result.current.ollamaStatus.isConnected).toBe(true);

    // Test de déconnexion
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'disconnected' })
      })
    );

    await act(async () => {
      await result.current.checkConnections(false);
    });

    expect(result.current.ollamaStatus.isConnected).toBe(false);
  });
});
