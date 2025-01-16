import { renderHook, act } from '@testing-library/react';
import { useChatError } from './useChatError';

describe('useChatError', () => {
  it('initialise l\'erreur à null', () => {
    const { result } = renderHook(() => useChatError());
    expect(result.current.error).toBeNull();
  });

  it('gère une erreur de type string', () => {
    const { result } = renderHook(() => useChatError());
    const errorMessage = 'Une erreur est survenue';

    act(() => {
      result.current.handleError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it('gère une erreur de type Error', () => {
    const { result } = renderHook(() => useChatError());
    const error = new Error('Une erreur est survenue');

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.error).toBe(error.message);
  });

  it('efface l\'erreur avec clearError', () => {
    const { result } = renderHook(() => useChatError());
    
    act(() => {
      result.current.handleError('Une erreur');
    });
    expect(result.current.error).toBe('Une erreur');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('retourne true après avoir effacé l\'erreur avec retryOperation', () => {
    const { result } = renderHook(() => useChatError());
    
    act(() => {
      result.current.handleError('Une erreur');
    });
    expect(result.current.error).toBe('Une erreur');

    let retryResult: boolean = false;
    act(() => {
      retryResult = result.current.retryOperation();
    });

    expect(result.current.error).toBeNull();
    expect(retryResult).toBe(true);
  });
});
