import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
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
=======
import { Client } from '@notionhq/client';

async function checkNotionConnection() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    // Tente de lister les bases de données
    await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });

    return { status: 'connected' as const };
  } catch (error) {
    console.error('Erreur lors de la connexion à Notion:', error);
    return { 
      status: 'disconnected' as const,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

export async function GET() {
  const status = await checkNotionConnection();
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  const status = await checkNotionConnection();
  return NextResponse.json(status);
}
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
