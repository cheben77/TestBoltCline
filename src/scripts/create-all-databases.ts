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

const databases = [
  {
    name: "Activités et Services",
    properties: {
      Name: { title: {} },
      Description: { rich_text: {} },
      Type: { 
        select: { 
          options: [
            { name: "Atelier", color: "blue" },
            { name: "Randonnée", color: "green" },
            { name: "Bivouac", color: "brown" },
            { name: "Bien-être", color: "purple" }
          ]
        }
      },
      "Public cible": {
        multi_select: {
          options: [
            { name: "Solo", color: "blue" },
            { name: "Famille", color: "green" },
            { name: "Couple", color: "pink" },
            { name: "Groupe", color: "orange" }
          ]
        }
      },
      Responsable: { rich_text: {} },
      Prix: { number: { format: "euro" } },
      Durée: { rich_text: {} },
      "Ressources nécessaires": { rich_text: {} },
      "Feedback client": { rich_text: {} }
    }
  },
  {
    name: "Clients",
    properties: {
      Name: { title: {} },
      "Coordonnées": { rich_text: {} },
      Email: { email: {} },
      Téléphone: { phone_number: {} },
      "Type de client": {
        select: {
          options: [
            { name: "Solo", color: "blue" },
            { name: "Famille", color: "green" },
            { name: "Couple", color: "pink" },
            { name: "Groupe", color: "orange" }
          ]
        }
      },
      "Activités réservées": { 
        relation: { 
          database_id: "",
          single_property: {}
        } 
      }, // Sera mis à jour après création
      "Fréquence de visite": {
        select: {
          options: [
            { name: "Occasionnelle", color: "gray" },
            { name: "Régulière", color: "green" }
          ]
        }
      },
      "Réduction fidélité": { number: { format: "percent" } }
    }
  },
  {
    name: "Partenariats et Fournisseurs",
    properties: {
      Name: { title: {} },
      "Type de partenariat": {
        select: {
          options: [
            { name: "Fournitures", color: "blue" },
            { name: "Collaboration", color: "green" },
            { name: "Marketing", color: "orange" }
          ]
        }
      },
      "Produits/services fournis": { rich_text: {} },
      "Conditions contractuelles": { rich_text: {} },
      "Contact principal": { rich_text: {} },
      "Historique transactions": { rich_text: {} },
      Localisation: { rich_text: {} },
      Notes: { rich_text: {} }
    }
  },
  {
    name: "Ressources et Stocks",
    properties: {
      Name: { title: {} },
      Catégorie: {
        select: {
          options: [
            { name: "Alimentation", color: "brown" },
            { name: "Matériel sportif", color: "blue" },
            { name: "Bivouac", color: "green" }
          ]
        }
      },
      "Quantité disponible": { number: {} },
      "Stock minimum": { number: {} },
      Fournisseur: { 
        relation: { 
          database_id: "",
          single_property: {}
        } 
      }, // Sera mis à jour après création
      "Date d'achat": { date: {} },
      État: {
        select: {
          options: [
            { name: "Neuf", color: "green" },
            { name: "Usé", color: "orange" },
            { name: "Réparé", color: "blue" }
          ]
        }
      },
      Coût: { number: { format: "euro" } }
    }
  },
  {
    name: "Indicateurs Écologiques",
    properties: {
      Name: { title: {} },
      "Activité/service": { 
        relation: { 
          database_id: "",
          single_property: {}
        } 
      }, // Sera mis à jour après création
      "Impact carbone": { number: {} },
      "Ressources consommées": { rich_text: {} },
      "Déchets générés": { rich_text: {} },
      "Mesures d'atténuation": { rich_text: {} },
      "Score impact": {
        select: {
          options: [
            { name: "Faible", color: "green" },
            { name: "Moyen", color: "yellow" },
            { name: "Élevé", color: "red" }
          ]
        }
      },
      Date: { date: {} }
    }
  }
];

async function createDatabase(db: any) {
  try {
    console.log(`Création de la base de données ${db.name}...`);
    const response = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: db.name } }],
      properties: db.properties
    });
    console.log(`Base de données ${db.name} créée avec l'ID:`, response.data.id);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la création de ${db.name}:`, (error as any).response?.data || error);
    throw error;
  }
}

async function createAllDatabases() {
  try {
    console.log('Création des bases de données...');
    const createdDbs: Record<string, string> = {};
    
    // Créer d'abord les bases sans relations
    for (const db of databases) {
      const created = await createDatabase(db);
      createdDbs[db.name] = created.id;
    }

    // Mettre à jour les relations
    console.log('Mise à jour des relations entre les bases de données...');
    
    // Clients -> Activités
    await notion.patch(`/databases/${createdDbs['Clients']}`, {
      properties: {
        "Activités réservées": {
          relation: { database_id: createdDbs['Activités et Services'] }
        }
      }
    });

    // Ressources -> Fournisseurs
    await notion.patch(`/databases/${createdDbs['Ressources et Stocks']}`, {
      properties: {
        Fournisseur: {
          relation: { database_id: createdDbs['Partenariats et Fournisseurs'] }
        }
      }
    });

    // Indicateurs -> Activités
    await notion.patch(`/databases/${createdDbs['Indicateurs Écologiques']}`, {
      properties: {
        "Activité/service": {
          relation: { database_id: createdDbs['Activités et Services'] }
        }
      }
    });

    // Mettre à jour .env.local avec les nouveaux IDs
    const fs = require('fs').promises;
    const envContent = await fs.readFile('.env.local', 'utf8');
    let updatedContent = envContent;
    
    for (const [name, id] of Object.entries(createdDbs)) {
      const envKey = `NOTION_${name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DB_ID`;
      updatedContent += `\n${envKey}=${id}`;
    }

    await fs.writeFile('.env.local', updatedContent);
    console.log('Fichier .env.local mis à jour avec les nouveaux IDs');

  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

createAllDatabases().catch(console.error);
