const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
});

async function createActivitiesDatabase() {
  try {
    console.log('Création de la base de données des activités...');
    
    const response = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: 'Activités StoaViva' } }],
      properties: {
        Name: { title: {} },
        Categorie: { 
          select: { 
            options: [
              { name: 'Activités Principales', color: 'blue' },
              { name: 'Activités Annexes', color: 'green' },
              { name: 'Services Éducatifs', color: 'orange' },
              { name: 'Produits de Santé', color: 'red' },
              { name: 'Hébergement & Logistique', color: 'purple' },
              { name: 'Événements et Partenariats', color: 'yellow' },
              { name: 'Marketing & Communication', color: 'pink' },
              { name: 'Écologie & Durabilité', color: 'brown' }
            ] 
          } 
        },
        'Sous-Categorie': { 
          select: { 
            options: [
              { name: "Kits d'expérience", color: 'blue' },
              { name: 'Nature et Bien-être', color: 'green' },
              { name: 'Ateliers pédagogiques', color: 'orange' },
              { name: 'Compléments alimentaires', color: 'red' },
              { name: 'Hébergement Airbnb', color: 'purple' },
              { name: 'Événements ponctuels', color: 'yellow' },
              { name: 'Digital', color: 'pink' },
              { name: 'Agroécologie', color: 'brown' }
            ] 
          } 
        },
        'Activités/Offres': { rich_text: {} },
        Objectifs: { rich_text: {} },
        'Ressources Nécessaires': { rich_text: {} },
        'Responsables/Collaborateurs': { 
          multi_select: { 
            options: [
              { name: 'Yannick', color: 'blue' },
              { name: 'Anthony', color: 'green' },
              { name: 'Harmonie', color: 'purple' },
              { name: 'Agroforestier', color: 'brown' }
            ] 
          } 
        },
        Status: {
          select: {
            options: [
              { name: 'En préparation', color: 'gray' },
              { name: 'Actif', color: 'green' },
              { name: 'En pause', color: 'orange' },
              { name: 'Terminé', color: 'red' }
            ]
          }
        },
        'Date de début': { date: {} },
        Budget: { number: { format: 'euro' } },
        'Impact écologique': {
          select: {
            options: [
              { name: 'Faible', color: 'green' },
              { name: 'Moyen', color: 'yellow' },
              { name: 'Élevé', color: 'red' }
            ]
          }
        }
      },
    });

    console.log('Base de données des activités créée:', response.data.id);

    // Mettre à jour .env.local avec le nouvel ID
    const fs = require('fs').promises;
    const envContent = await fs.readFile('.env.local', 'utf8');
    const updatedContent = envContent + '\nNOTION_ACTIVITIES_DB_ID=' + response.data.id;
    await fs.writeFile('.env.local', updatedContent);
    
    console.log('Fichier .env.local mis à jour avec le nouvel ID');
    return response.data;

  } catch (error) {
    console.error('Erreur:', (error as any).response?.data || error);
    throw error;
  }
}

createActivitiesDatabase().catch(console.error);
