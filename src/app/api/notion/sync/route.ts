import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { databaseId, content } = await request.json();

    if (!databaseId) {
      return NextResponse.json(
        { error: 'ID de base de données manquant' },
        { status: 400 }
      );
    }

    // Créer une nouvelle page dans la base de données
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: new Date().toISOString(),
              },
            },
          ],
        },
        Content: {
          rich_text: [
            {
              text: {
                content: content,
              },
            },
          ],
        },
        Language: {
          select: {
            name: 'typescript', // Par défaut
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Contenu synchronisé avec Notion',
      pageId: response.id,
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec Notion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation avec Notion' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const databaseId = searchParams.get('databaseId');

    if (!databaseId) {
      return NextResponse.json(
        { error: 'ID de base de données manquant' },
        { status: 400 }
      );
    }

    // Récupérer les pages de la base de données
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Name',
          direction: 'descending',
        },
      ],
    });

    const templates = response.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Name.title[0]?.text.content || 'Sans titre',
      content: page.properties.Content.rich_text[0]?.text.content || '',
      language: page.properties.Language.select?.name || 'text',
    }));

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erreur lors de la récupération depuis Notion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération depuis Notion' },
      { status: 500 }
    );
  }
}
