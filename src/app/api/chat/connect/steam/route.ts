import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implémenter l'authentification Steam OpenID
    // Pour l'instant, simuler une connexion réussie
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Erreur lors de la connexion à Steam:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion à Steam' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Vérifier le statut de la connexion à Steam
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut Steam:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
