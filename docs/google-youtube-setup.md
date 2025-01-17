# Configuration de Google et YouTube

Ce guide explique comment configurer les connexions Google et YouTube pour le chatbot StoaViva.

## Prérequis

1. Un compte Google
2. Node.js et npm installés
3. Le projet StoaViva cloné localement

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - YouTube Data API v3
   - Google OAuth2 API

### 2. Configurer les identifiants OAuth

1. Dans la console Google Cloud, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth client ID"
3. Sélectionnez "Web application"
4. Donnez un nom à votre application
5. Ajoutez l'URI de redirection : `http://localhost:3001/oauth2callback`
6. Cliquez sur "Create"
7. Notez le Client ID et le Client Secret

### 3. Configurer les variables d'environnement

1. Copiez le fichier `.env.local.example` en `.env.local` si ce n'est pas déjà fait
2. Ajoutez vos identifiants Google :
   ```
   GOOGLE_CLIENT_ID=votre_client_id
   GOOGLE_CLIENT_SECRET=votre_client_secret
   ```

### 4. Obtenir les tokens d'authentification

1. Exécutez la commande suivante :
   ```bash
   npm run auth:google
   ```
2. Un navigateur s'ouvrira pour vous connecter à votre compte Google
3. Autorisez l'application
4. Les tokens seront affichés dans la console
5. Copiez les tokens dans votre fichier `.env.local` :
   ```
   GOOGLE_REFRESH_TOKEN=votre_refresh_token
   YOUTUBE_REFRESH_TOKEN=votre_refresh_token
   ```

## Utilisation

Une fois configuré, le chatbot pourra :
- Accéder aux informations de votre compte Google
- Interagir avec YouTube (lire des vidéos, obtenir des informations sur les chaînes, etc.)

## Dépannage

### Les connexions ne fonctionnent pas

1. Vérifiez que tous les tokens sont correctement configurés dans `.env.local`
2. Assurez-vous que les APIs nécessaires sont activées dans la console Google Cloud
3. Vérifiez que les URIs de redirection sont correctement configurées
4. Si nécessaire, régénérez les tokens avec `npm run auth:google`

### Erreurs d'authentification

- Si vous obtenez des erreurs d'authentification, essayez de :
  1. Régénérer les tokens
  2. Vérifier que le projet est bien configuré dans la console Google Cloud
  3. Vérifier que les scopes OAuth sont correctement configurés

## Sécurité

- Ne partagez jamais vos tokens ou identifiants
- Ne commettez pas le fichier `.env.local` dans Git
- Utilisez des variables d'environnement pour la production
