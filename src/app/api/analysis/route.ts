import { NextResponse } from 'next/server';
import { 
  analyzeProductsAndCreateReport, 
  suggestCustomKitForClient, 
  generateEcoReport,
  ClientPreferences 
} from '@/lib/integration';

export async function GET() {
  try {
    const analysis = await analyzeProductsAndCreateReport();
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    switch (type) {
      case 'kit': {
        const preferences = body.preferences as ClientPreferences;
        if (!preferences) {
          return NextResponse.json(
            { error: 'Préférences client requises' },
            { status: 400 }
          );
        }
        const suggestion = await suggestCustomKitForClient(preferences);
        return NextResponse.json(suggestion);
      }

      case 'eco-report': {
        const report = await generateEcoReport();
        return NextResponse.json({ report });
      }

      default:
        return NextResponse.json(
          { error: 'Type d\'analyse non supporté' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
}
