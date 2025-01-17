import { NextResponse } from 'next/server';

async function checkInternetConnection() {
  try {
    // Tester la connexion avec Google
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      // Court timeout pour éviter d'attendre trop longtemps
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion Internet:', error);
    return false;
  }
}

export async function GET() {
  try {
    const isConnected = await checkInternetConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Connexion Internet active' : 'Pas de connexion Internet'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Internet:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Internet'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const isConnected = await checkInternetConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Connexion Internet active' : 'Pas de connexion Internet'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Internet:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Internet'
    }, { status: 500 });
  }
}
