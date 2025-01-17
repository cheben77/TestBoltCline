const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config({ path: '.env.local' });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = '177151e8ba2980d2a6a5c8f768ec85e4';

const notionClient = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
});

interface NotionResponse {
  id: string;
  properties: Record<string, any>;
}

async function createDatabase(title: string, properties: any): Promise<NotionResponse> {
  try {
    const response = await notionClient.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: title } }],
      properties: properties,
    });
    return response.data as NotionResponse;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Failed to create database: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function createDatabases() {
  try {
    console.log('Clé API utilisée:', NOTION_API_KEY);
    console.log('Création des bases de données...');

    // Créer la base de données des personnes
    const personsDb = await createDatabase('Personnes StoaViva', {
      Name: { title: {} },
      Age: { number: {} },
      Email: { email: {} },
      Phone: { phone_number: {} },
      Status: { 
        select: { 
          options: [
            { name: 'Prospect', color: 'blue' },
            { name: 'Client', color: 'green' },
            { name: 'Inactif', color: 'gray' }
          ] 
        } 
      },
      Interests: { 
        multi_select: { 
          options: [
            { name: 'Bien-être', color: 'green' },
            { name: 'Écologie', color: 'blue' },
            { name: 'Aromathérapie', color: 'purple' },
            { name: 'Méditation', color: 'yellow' },
            { name: 'Yoga', color: 'orange' }
          ] 
        } 
      },
      LastContact: { date: {} },
      Notes: { rich_text: {} },
    });
    console.log('Base de données des personnes créée:', personsDb.id);

    // Créer la base de données des produits
    const productsDb = await createDatabase('Produits StoaViva', {
      Name: { title: {} },
      Category: { select: { options: [{ name: 'Aromathérapie' }, { name: 'Bien-être' }] } },
      Price: { number: {} },
      Stock: { number: {} },
      Description: { rich_text: {} },
      EcologicalImpact: { rich_text: {} },
      Benefits: { rich_text: {} },
      UsageInstructions: { rich_text: {} },
      Ingredients: { multi_select: {} },
      Certifications: { multi_select: {} },
    });
    console.log('Base de données des produits créée:', productsDb.id);

    // Mettre à jour le fichier .env.local avec les nouveaux IDs
    const envContent = `# Notion API Configuration
NOTION_API_KEY=${NOTION_API_KEY}
NOTION_PARENT_PAGE_ID=${PARENT_PAGE_ID}

# Notion Database IDs
NOTION_PUBLICS_DB_ID=${personsDb.id}
NOTION_PRODUCTS_DB_ID=${productsDb.id}

# Ollama Configuration
OLLAMA_ENDPOINT=http://127.0.0.1:11434/api

# Autres configurations
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development`;

    await fs.writeFile('.env.local', envContent);
    console.log('Fichier .env.local mis à jour avec les nouveaux IDs');

  } catch (error) {
    console.error('Erreur lors de la création des bases de données:', error);
    throw error;
  }
}

// Exécuter le script
createDatabases().catch(console.error);
