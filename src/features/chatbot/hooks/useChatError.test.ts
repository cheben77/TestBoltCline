import { renderHook, act } from '@testing-library/react';
import { useChatError, ChatError, ChatErrorType } from './useChatError';

describe('useChatError', () => {
  it('initialise avec un état vide', () => {
    const { result } = renderHook(() => useChatError());

    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toEqual([]);
  });

  it('gère une erreur avec handleError', () => {
    const { result } = renderHook(() => useChatError());

    act(() => {
      result.current.handleError('Test error message', 'network');
    });

    expect(result.current.error?.message).toBe('Test error message');
    expect(result.current.error?.type).toBe('network');
    expect(result.current.errorHistory).toHaveLength(1);
    expect(result.current.errorHistory[0].message).toBe('Test error message');
  });

  it('ajoute plusieurs erreurs à l\'historique', () => {
    const { result } = renderHook(() => useChatError());

    act(() => {
      result.current.handleError('First error', 'network');
      result.current.handleError('Second error', 'notion');
      result.current.handleError('Third error', 'ollama');
    });

    expect(result.current.error?.message).toBe('Third error');
    expect(result.current.errorHistory).toHaveLength(3);
    expect(result.current.errorHistory[0].message).toBe('Third error');
    expect(result.current.errorHistory[2].message).toBe('First error');
  });

  it('efface l\'erreur actuelle avec clearError', () => {
    const { result } = renderHook(() => useChatError());

    act(() => {
      result.current.handleError('Test error', 'network');
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toHaveLength(1);
  });

  it('limite la taille de l\'historique des erreurs', () => {
    const maxHistoryLength = 3;
    const { result } = renderHook(() => useChatError({ maxHistoryLength }));

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.handleError(`Error ${i}`, 'network');
      }
    });

    expect(result.current.errorHistory.length).toBe(maxHistoryLength);
    expect(result.current.errorHistory[0].message).toBe('Error 4');
    expect(result.current.errorHistory[2].message).toBe('Error 2');
  });

  it('efface l\'historique avec clearHistory', () => {
    const { result } = renderHook(() => useChatError());

    act(() => {
      result.current.handleError('First error', 'network');
      result.current.handleError('Second error', 'notion');
      result.current.clearHistory();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toEqual([]);
  });

  it('gère les erreurs avec des objets Error', () => {
    const { result } = renderHook(() => useChatError());

    act(() => {
      result.current.handleError(new Error('Test error object'), 'network');
    });

    expect(result.current.error?.message).toBe('Test error object');
    expect(result.current.error?.type).toBe('network');
  });

  it('appelle le callback onError quand une erreur est ajoutée', () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useChatError({ onError }));

    act(() => {
      result.current.handleError('Test error', 'network');
    });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Test error',
      type: 'network'
    }));
  });

  it('retourne le message d\'erreur approprié selon le type', () => {
    const { result } = renderHook(() => useChatError());
    const error = result.current.handleError('Test error', 'network');

    expect(result.current.getErrorMessage(error))
      .toBe('Erreur de connexion. Veuillez vérifier votre connexion internet.');

    const notionError = result.current.handleError('Notion error', 'notion');
    expect(result.current.getErrorMessage(notionError))
      .toBe('Erreur lors de l\'accès à la base de données Notion.');
  });

  it('détecte correctement les erreurs réseau', () => {
    const { result } = renderHook(() => useChatError());

    expect(result.current.isNetworkError(new Error('Failed to fetch'))).toBe(true);
    expect(result.current.isNetworkError(new Error('Network request failed'))).toBe(true);
    expect(result.current.isNetworkError(new Error('ECONNREFUSED'))).toBe(true);
    expect(result.current.isNetworkError(new Error('Other error'))).toBe(false);
  });

  it('inclut les détails supplémentaires dans l\'erreur', () => {
    const { result } = renderHook(() => useChatError());
    const details = { code: 404, endpoint: '/api/test' };

    act(() => {
      result.current.handleError('Not found', 'network', details);
    });

    expect(result.current.error?.details).toEqual(details);
  });
});
