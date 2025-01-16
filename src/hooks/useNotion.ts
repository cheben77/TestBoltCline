import { useState, useCallback } from 'react';
import { notionService } from '@/services/notion';
import type { Product, Service, CalendarEvent, DatabaseSchema, NotionError } from '@/types/notion';

export interface DatabaseContext {
  databases: DatabaseSchema[];
  query: string;
}

export interface ServiceWithAvailability extends Service {
  availability: Array<{
    day: string;
    time: string;
    available: boolean;
  }>;
}

export interface QueryContext {
  products: Product[];
  services: ServiceWithAvailability[];
  events: CalendarEvent[];
  query: string;
}

export type NotionContext = DatabaseContext | QueryContext;

export function isQueryContext(context: NotionContext): context is QueryContext {
  return 'products' in context;
}

export function isDatabaseContext(context: NotionContext): context is DatabaseContext {
  return 'databases' in context;
}

interface UseNotionContextOptions {
  onError?: (error: NotionError) => void;
}

export function useNotionContext(options: UseNotionContextOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<NotionError | null>(null);
  const [context, setContext] = useState<NotionContext | null>(null);

  const getContextForQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contextData = await notionService.getContextForQuery(query);
      if (!isDatabaseContext(contextData) && !isQueryContext(contextData)) {
        throw new Error('Format de contexte Notion invalide');
      }
      setContext(contextData);
      return contextData;
    } catch (err) {
      const error: NotionError = err instanceof Error ? err : new Error('Erreur lors de la récupération du contexte Notion');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearContext = useCallback(() => {
    setContext(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    context,
    getContextForQuery,
    clearContext,
    isQueryContext,
    isDatabaseContext
  };
}

export default useNotionContext;
