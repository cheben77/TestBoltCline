import { NextRequest, NextResponse } from 'next/server';
import { ollamaService } from '@/services/ollama';

export async function GET(request: NextRequest) {
  try {
    const models = await ollamaService.getModels();
    return NextResponse.json({ connected: models.length > 0 });
  } catch (error) {
    console.error('Erreur lors de la vérification d\'Ollama:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification d\'Ollama' },
      { status: 500 }
    );
  }
}
