import { NextRequest, NextResponse } from 'next/server';
import { ollamaService } from '@/services/ollama';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Vérifier que les données sont valides
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    // Sauvegarder les données dans le stockage local
    localStorage.setItem('chatbot_data', JSON.stringify(data));

    // Réinitialiser la connexion avec Ollama
    await ollamaService.getModels();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'importation des données' },
      { status: 500 }
    );
  }
}
