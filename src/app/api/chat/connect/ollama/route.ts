import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json({ 
      status: 'connected',
      models: data.models || []
    });
  } catch (error) {
    console.error('Erreur de connexion à Ollama:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de connexion à Ollama'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json({ 
      status: 'connected',
      models: data.models || []
    });
  } catch (error) {
    console.error('Erreur de connexion à Ollama:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de connexion à Ollama'
    }, { status: 500 });
  }
}
