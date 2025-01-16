import { renderHook, act } from '@testing-library/react';
import { useChatError, type ChatError } from './useChatError';

describe('useChatError', () => {
  it('initialise avec un état vide', () => {
    const { result } = renderHook(() => useChatError());
    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toEqual([]);
  });

  it('gère une nouvelle erreur', () => {
    const { result } = renderHook(() => useChatError());
    const errorMessage = 'Test error';
    
    act(() => {
      result.current.handleError(errorMessage, 'network');
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.error?.type).toBe('network');
    expect(result.current.errorHistory).toHaveLength(1);
  });

  it('efface l\'erreur courante', () => {
    const { result } = renderHook(() => useChatError());
    
    act(() => {
      result.current.handleError('Test error');
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toHaveLength(1);
  });

  it('efface l\'historique des erreurs', () => {
    const { result } = renderHook(() => useChatError());
    
    act(() => {
      result.current.handleError('Error 1');
      result.current.handleError('Error 2');
      result.current.clearHistory();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errorHistory).toHaveLength(0);
  });

  it('limite la taille de l\'historique', () => {
    const maxHistoryLength = 2;
    const { result } = renderHook(() => useChatError({ maxHistoryLength }));
    
    act(() => {
      result.current.handleError('Error 1');
      result.current.handleError('Error 2');
      result.current.handleError('Error 3');
    });

    expect(result.current.errorHistory).toHaveLength(maxHistoryLength);
    expect(result.current.errorHistory[0].message).toBe('Error 3');
    expect(result.current.errorHistory[1].message).toBe('Error 2');
  });

  it('appelle le callback onError', () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useChatError({ onError }));
    
    act(() => {
      result.current.handleError('Test error');
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Object));
  });

  it('retourne le bon message d\'erreur selon le type', () => {
    const { result } = renderHook(() => useChatError());
    const error = result.current.handleError('Test error', 'network');
    
    expect(result.current.getErrorMessage(error))
      .toBe('Erreur de connexion. Veuillez vérifier votre connexion internet.');
  });

  it('détecte les erreurs réseau', () => {
    const { result } = renderHook(() => useChatError());
    const networkError = new Error('Failed to fetch');
    const otherError = new Error('Some other error');

    expect(result.current.isNetworkError(networkError)).toBe(true);
    expect(result.current.isNetworkError(otherError)).toBe(false);
  });
});
