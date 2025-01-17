import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

async function getGoogleAccessToken() {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      throw new Error('Identifiants Google manquants');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur Google: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token Google:', error);
    throw error;
  }
}

async function checkGoogleConnection() {
  try {
    const accessToken = await getGoogleAccessToken();
    
    // Tester l'accès à l'API Google
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de Google:', error);
    return false;
  }
}

export async function GET() {
  try {
    const isConnected = await checkGoogleConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Google connecté' : 'Google non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Google:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Google'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const isConnected = await checkGoogleConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Google connecté' : 'Google non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Google:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Google'
    }, { status: 500 });
  }
}
