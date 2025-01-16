import { NextRequest, NextResponse } from 'next/server';
import { notionService } from '@/services/notion';

export async function GET(request: NextRequest) {
  try {
    // Tente de récupérer un seul produit pour vérifier la connexion
    const response = await notionService.getProducts({ page_size: 1 });
    return NextResponse.json({ 
      connected: true,
      databaseId: process.env.NOTION_PRODUCTS_DATABASE_ID,
      hasResults: response.results.length > 0
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de Notion:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la vérification de Notion',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
