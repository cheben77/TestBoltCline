const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ACTIVITES_DB_ID = process.env.NOTION_ACTIVITES_ET_SERVICES_DB_ID;
const CLIENTS_DB_ID = process.env.NOTION_CLIENTS_DB_ID;
const FOURNISSEURS_DB_ID = process.env.NOTION_PARTENARIATS_ET_FOURNISSEURS_DB_ID;
const RESSOURCES_DB_ID = process.env.NOTION_RESSOURCES_ET_STOCKS_DB_ID;
const INDICATEURS_DB_ID = process.env.NOTION_INDICATEURS_ECOLOGIQUES_DB_ID;

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
});

async function addRelations() {
  try {
    console.log('Ajout des relations entre les bases de données...');

    // Clients -> Activités
    console.log('Ajout de la relation Clients -> Activités...');
    await notion.patch(`/databases/${CLIENTS_DB_ID}`, {
      properties: {
        "Activités réservées": {
          type: "relation",
          relation: {
            database_id: ACTIVITES_DB_ID,
            single_property: {}
          }
        }
      }
    });

    // Ressources -> Fournisseurs
    console.log('Ajout de la relation Ressources -> Fournisseurs...');
    await notion.patch(`/databases/${RESSOURCES_DB_ID}`, {
      properties: {
        "Fournisseur": {
          type: "relation",
          relation: {
            database_id: FOURNISSEURS_DB_ID,
            single_property: {}
          }
        }
      }
    });

    // Indicateurs -> Activités
    console.log('Ajout de la relation Indicateurs -> Activités...');
    await notion.patch(`/databases/${INDICATEURS_DB_ID}`, {
      properties: {
        "Activité/service": {
          type: "relation",
          relation: {
            database_id: ACTIVITES_DB_ID,
            single_property: {}
          }
        }
      }
    });

    console.log('Relations ajoutées avec succès !');

  } catch (error) {
    console.error('Erreur lors de l\'ajout des relations:', (error as any).response?.data || error);
    throw error;
  }
}

addRelations().catch(console.error);
