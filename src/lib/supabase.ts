import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Types pour les mouvements de stock
export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  type: 'in' | 'out';
  reason?: string;
  created_at: string;
  updated_at: string;
}

// Types pour les événements
export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  location?: {
    address: string;
    coordinates?: [number, number];
  };
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Hooks pour les données en temps réel
export const useRealtimeStock = (productId: string, onUpdate: (quantity: number) => void) => {
  const subscription = supabase
    .channel('stock_movements')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stock_movements',
        filter: `product_id=eq.${productId}`
      },
      async () => {
        // Récupérer le stock actuel
        const { data } = await supabase
          .from('current_stock')
          .select('quantity')
          .eq('product_id', productId)
          .single();
        
        if (data) {
          onUpdate(data.quantity);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Gestion des produits en cache
export const syncNotionProducts = async (products: any[]) => {
  const { error } = await supabase
    .from('products_cache')
    .upsert(
      products.map(product => ({
        id: product.id,
        notion_id: product.notion_id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        eco_impact: product.eco_impact,
        updated_at: new Date().toISOString()
      })),
      { onConflict: 'notion_id' }
    );

  if (error) {
    console.error('Erreur lors de la synchronisation des produits:', error);
    throw error;
  }
};

// Gestion des événements
export const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const registerForEvent = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([
      {
        event_id: eventId,
        user_id: userId,
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Gestion du stock
export const updateStock = async (
  productId: string,
  quantity: number,
  type: 'in' | 'out',
  reason?: string
) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .insert([
      {
        product_id: productId,
        quantity: Math.abs(quantity),
        type,
        reason
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Utilitaires pour l'authentification
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }
  
  return user;
};
