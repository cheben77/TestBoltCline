import { NextRequest, NextResponse } from 'next/server';
import { ollamaService } from '@/services/ollama';
import { notionService } from '@/services/notion';

export async function POST(request: NextRequest) {
  try {
    // Vérifier la connexion avec Ollama
    const models = await ollamaService.getModels();
    if (!models || models.length === 0) {
      return NextResponse.json(
        { error: 'Impossible de se connecter à Ollama' },
        { status: 500 }
      );
    }

    // Vérifier la connexion avec Notion
    try {
      await notionService.getProducts({ page_size: 1 });
    } catch (error) {
      console.warn('Notion non disponible:', error);
      // On continue même si Notion n'est pas disponible
    }

    // Stocker l'état de connexion dans un cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('chatbot_connected', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const connected = request.cookies.get('chatbot_connected')?.value === 'true';
    return NextResponse.json({ connected });
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de la connexion' },
      { status: 500 }
    );
  }
}
