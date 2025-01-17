import express from 'express';
import open from 'open';
import { google } from 'googleapis';

const app = express();
const port = 3001;

// Ces valeurs devront être remplacées par les identifiants de l'application Google
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${port}/oauth2callback`;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Définir les scopes nécessaires
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Force à demander un refresh token
  });
  
  // Ouvrir le navigateur pour l'authentification
  open(authUrl);
  
  res.send('Veuillez vous authentifier dans le navigateur...');
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\nVoici vos tokens Google :\n');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\nAjoutez ces tokens dans votre fichier .env.local :\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
    
    res.send('Authentification réussie ! Vous pouvez fermer cette fenêtre.');
    
    // Arrêter le serveur après l'authentification
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('Erreur lors de l\'échange du code :', error);
    res.status(500).send('Erreur lors de l\'authentification');
  }
});

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nErreur : CLIENT_ID et CLIENT_SECRET sont requis.\n');
  console.log('1. Allez sur https://console.cloud.google.com/');
  console.log('2. Créez un projet ou sélectionnez un projet existant');
  console.log('3. Activez l\'API YouTube Data API v3');
  console.log('4. Dans "Identifiants", créez un ID client OAuth 2.0');
  console.log('5. Ajoutez http://localhost:3001/oauth2callback aux URIs de redirection autorisés');
  console.log('6. Copiez le CLIENT_ID et CLIENT_SECRET dans votre .env.local :\n');
  console.log('GOOGLE_CLIENT_ID=votre_client_id');
  console.log('GOOGLE_CLIENT_SECRET=votre_client_secret\n');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`\nServeur d'authentification démarré sur http://localhost:${port}`);
  console.log('Ouverture du navigateur pour l\'authentification...\n');
});
