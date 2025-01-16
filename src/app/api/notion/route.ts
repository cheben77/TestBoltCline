import { NextResponse } from 'next/server';
import { notionService } from '@/services/notion';
import { mockEcologicalImpact } from '@/data/mockData';

const isDev = process.env.NODE_ENV === 'development';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type === 'eco-impact') {
      if (isDev) {
        return NextResponse.json({ data: mockEcologicalImpact });
      }
      const data = await notionService.getEcologicalImpact();
      return NextResponse.json({ data });
    }

    return NextResponse.json(
      { error: 'Type de données non spécifié' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des données Notion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
