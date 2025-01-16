// Types de base
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: Record<string, any>;
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: Record<string, {
    id: string;
    name: string;
    type: string;
    [key: string]: any;
  }>;
}

// Types pour les données transformées
export interface Product {
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

export interface Service {
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

export interface CalendarEvent {
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

// Types pour les données brutes de l'API Notion
export interface NotionRawProduct extends Product {}
export interface NotionRawService extends Service {}
export interface NotionRawEvent extends CalendarEvent {}

export interface NotionRawQueryContext {
  products: NotionRawProduct[];
  services: NotionRawService[];
  events: NotionRawEvent[];
  query: string;
  filters?: Record<string, any>;
}

export interface NotionRawDatabaseContext {
  databases: Array<{
    name: string;
    id: string;
    properties: Record<string, any>;
  }>;
  query: string;
}

export type NotionRawContext = NotionRawDatabaseContext | NotionRawQueryContext;

// Types pour les erreurs
export interface NotionError extends Error {
  status?: number;
  code?: string;
  requestId?: string;
}

// Types pour les résultats de requête
export interface QueryResult<T> {
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

// Types pour le contexte
export interface DatabaseContext {
  databases: Array<{
    name: string;
    id: string;
    properties: Record<string, any>;
  }>;
  query: string;
}

export interface QueryContext {
  products: Product[];
  services: Service[];
  events: CalendarEvent[];
  query: string;
  filters?: Record<string, any>;
}

export type NotionContext = DatabaseContext | QueryContext;

// Types pour la configuration
export interface DatabaseSchema {
  name: string;
  id: string;
  properties: Record<string, {
    type: string;
    name: string;
    required?: boolean;
    options?: string[];
  }>;
}

export interface DatabaseConfig {
  id: string;
  name: string;
  schema: {
    [key: string]: {
      type: string;
      name: string;
      required?: boolean;
      options?: string[];
    };
  };
}

export interface NotionConfig {
  databases: {
    products: DatabaseConfig;
    services: DatabaseConfig;
    events: DatabaseConfig;
    eco_impact: DatabaseConfig;
  };
  integrations: {
    chatbot: {
      prompt_template: string;
      max_context_length: number;
      relevant_properties: string[];
    };
  };
}
