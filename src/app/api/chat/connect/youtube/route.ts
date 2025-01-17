import { NextResponse } from 'next/server';

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const YOUTUBE_REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

async function getYouTubeAccessToken() {
  try {
    if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
      throw new Error('Identifiants YouTube manquants');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        refresh_token: YOUTUBE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur YouTube: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token YouTube:', error);
    throw error;
  }
}

async function checkYouTubeConnection() {
  try {
    const accessToken = await getYouTubeAccessToken();
    
    // Tester l'accès à l'API YouTube en récupérant la chaîne de l'utilisateur
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de YouTube:', error);
    return false;
  }
}

export async function GET() {
  try {
    const isConnected = await checkYouTubeConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'YouTube connecté' : 'YouTube non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification YouTube:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification YouTube'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const isConnected = await checkYouTubeConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'YouTube connecté' : 'YouTube non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification YouTube:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification YouTube'
    }, { status: 500 });
  }
}
