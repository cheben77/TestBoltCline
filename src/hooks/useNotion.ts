import { useState, useCallback } from 'react';
import { notionService } from '@/services/notion';
import type { 
  NotionContext, 
  DatabaseContext, 
  QueryContext,
  NotionError,
  Product,
  Service,
  CalendarEvent
} from '@/types/notion';

// Types pour les données brutes de l'API Notion
interface NotionRawProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  eco_impact: {
    score: number;
    details: string[];
  };
  certifications: string[];
  ingredients: string[];
  benefits: string[];
  usage_instructions: string;
  created_at: string;
  updated_at: string;
}

interface NotionRawService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  capacity: number;
  instructor: string;
  prerequisites: string[];
  benefits: string[];
  eco_impact: {
    score: number;
    details: string[];
  };
  schedule: {
    days: string[];
    times: string[];
  };
  location: string;
  created_at: string;
  updated_at: string;
}

interface NotionRawEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  }>;
  service_id?: string;
  instructor?: string;
  created_at: string;
  updated_at: string;
}

interface NotionRawQueryContext {
  products: NotionRawProduct[];
  services: NotionRawService[];
  events: NotionRawEvent[];
  query: string;
  filters?: Record<string, any>;
}

interface NotionRawDatabaseContext {
  databases: Array<{
    name: string;
    id: string;
    properties: Record<string, any>;
  }>;
  query: string;
}

type NotionRawContext = NotionRawDatabaseContext | NotionRawQueryContext;

export function useNotionContext() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<NotionError | null>(null);
  const [context, setContext] = useState<NotionContext | null>(null);

  const getContextForQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contextData = await notionService.getContextForQuery(query) as NotionRawContext;
      
      // Valider et transformer les données
      const transformedData: NotionContext = 'databases' in contextData
        ? {
            databases: contextData.databases.map(db => ({
              name: db.name,
              id: db.id,
              properties: db.properties
            })),
            query: contextData.query
          }
        : {
            products: (contextData as NotionRawQueryContext).products,
            services: (contextData as NotionRawQueryContext).services,
            events: (contextData as NotionRawQueryContext).events,
            query: contextData.query,
            filters: (contextData as NotionRawQueryContext).filters
          };

      setContext(transformedData);
      return transformedData;
    } catch (err) {
      const error: NotionError = err instanceof Error 
        ? { 
            ...err,
            status: (err as any).status,
            code: (err as any).code,
            requestId: (err as any).requestId
          }
        : new Error('Erreur lors de la récupération du contexte Notion');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearContext = useCallback(() => {
    setContext(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    context,
    getContextForQuery,
    clearContext
  };
}

export default useNotionContext;
