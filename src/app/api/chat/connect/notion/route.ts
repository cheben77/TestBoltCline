import { NextRequest, NextResponse } from 'next/server';
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
