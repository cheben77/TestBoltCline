import { NextResponse } from 'next/server';
import { notionService } from '@/services/notion';

export async function GET() {
  try {
    const isConnected = await notionService.testConnection();
    if (isConnected) {
      const products = await notionService.getProducts();
      return NextResponse.json({ 
        status: 'connected',
        products: products.length,
        message: 'Connexion à Notion établie'
      });
    } else {
      throw new Error('Impossible de se connecter à Notion');
    }
  } catch (error) {
    console.error('Erreur de connexion Notion:', error);
    return NextResponse.json(
      { 
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Impossible de se connecter à Notion'
      },
      { status: 500 }
    );
  }
}
