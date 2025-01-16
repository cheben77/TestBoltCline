import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implémenter l'authentification OAuth2 avec Google
    // Pour l'instant, simuler une connexion réussie
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Erreur lors de la connexion à Google:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion à Google' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Vérifier le statut de la connexion à Google
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut Google:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
