<<<<<<< HEAD
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
=======
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json(false);
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  }
}
