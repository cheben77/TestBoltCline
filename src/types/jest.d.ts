import type { Mock } from 'jest-mock';
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }

  // Extend the Jest namespace
  export const jest: {
    fn: () => Mock;
    spyOn: (object: any, method: string) => Mock;
    mock: (moduleName: string) => any;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
    useRealTimers: () => void;
    useFakeTimers: () => void;
    runAllTimers: () => void;
    runOnlyPendingTimers: () => void;
    advanceTimersByTime: (msToRun: number) => void;
  };

  // Add types for mocked functions
  interface Mock<T = any, Y extends any[] = any> {
    (...args: Y): T;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockReturnValueOnce: (value: T) => Mock<T, Y>;
    mockResolvedValue: (value: T) => Mock<Promise<T>, Y>;
    mockResolvedValueOnce: (value: T) => Mock<Promise<T>, Y>;
    mockRejectedValue: (value: any) => Mock<Promise<T>, Y>;
    mockRejectedValueOnce: (value: any) => Mock<Promise<T>, Y>;
    mockClear: () => void;
    mockReset: () => void;
    mockRestore: () => void;
    mockName: (name: string) => Mock<T, Y>;
    getMockName: () => string;
    mock: {
      calls: Y[];
      results: { type: 'return' | 'throw'; value: any }[];
      instances: T[];
      contexts: any[];
      lastCall: Y;
    };
    mockReturnThis: () => Mock<T, Y>;
    mockImplementationOnce: (fn: (...args: Y) => T) => Mock<T, Y>;
    withImplementation: (
      fn: (...args: Y) => T,
      callback: () => Promise<void>
    ) => Promise<void>;
  }

  interface MockInstance<T, Y extends any[]> extends Mock<T, Y> {}
}

export {};
