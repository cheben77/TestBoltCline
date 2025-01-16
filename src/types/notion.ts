export interface Person {
  id: string;
  name: string;
  age: number;
  interests: string[];
  email: string;
  phone: string;
  status: string;
  last_contact: string;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  ecological_impact: string;
  benefits: string;
  usage_instructions: string;
  ingredients: string[];
  certifications: string[];
}

export interface Service {
  id: string;
  name: string;
  type: string;
  duration: number;
  capacity: number;
  location: string;
  description: string;
  benefits: string;
  price: number;
  instructor: string;
  schedule: string;
  prerequisites: string[];
  difficulty_level?: 'débutant' | 'intermédiaire' | 'avancé';
}

export interface EcoImpact {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  date: string;
  category: string;
  description: string;
  improvement_actions: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location?: string;
  description?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface DatabaseSchema {
  name: string;
  id: string;
  properties: Record<string, any>;
}

export interface NotionError extends Error {
  code?: string;
  requestId?: string;
  status?: number;
}
