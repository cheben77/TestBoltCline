import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getSpotifyAccessToken() {
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
      throw new Error('Identifiants Spotify manquants');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur Spotify: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token Spotify:', error);
    throw error;
  }
}

async function checkSpotifyConnection() {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    // Tester l'accès à l'API Spotify
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de Spotify:', error);
    return false;
  }
}

export async function GET() {
  try {
    const isConnected = await checkSpotifyConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Spotify connecté' : 'Spotify non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Spotify:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Spotify'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const isConnected = await checkSpotifyConnection();
    return NextResponse.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: isConnected ? 'Spotify connecté' : 'Spotify non connecté'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification Spotify:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification Spotify'
    }, { status: 500 });
  }
}
