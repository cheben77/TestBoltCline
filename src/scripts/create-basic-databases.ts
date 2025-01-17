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

async function createDatabases() {
  try {
    console.log('Création des bases de données...');
    const createdDbs: Record<string, string> = {};

    // Créer d'abord la base Activités et Services
    console.log('Création de la base Activités et Services...');
    const activitesDb = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: "Activités et Services" } }],
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
    });
    createdDbs["Activités et Services"] = activitesDb.data.id;

    // Créer la base Clients avec relation vers Activités
    console.log('Création de la base Clients...');
    const clientsDb = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: "Clients" } }],
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
          type: "relation",
          relation: {
            database_id: activitesDb.data.id,
            single_property: {}
          }
        },
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
    });
    createdDbs["Clients"] = clientsDb.data.id;

    // Créer la base Partenariats et Fournisseurs
    console.log('Création de la base Partenariats et Fournisseurs...');
    const fournisseursDb = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: "Partenariats et Fournisseurs" } }],
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
    });
    createdDbs["Partenariats et Fournisseurs"] = fournisseursDb.data.id;

    // Créer la base Ressources et Stocks avec relation vers Fournisseurs
    console.log('Création de la base Ressources et Stocks...');
    const ressourcesDb = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: "Ressources et Stocks" } }],
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
        "Fournisseur": {
          type: "relation",
          relation: {
            database_id: fournisseursDb.data.id,
            single_property: {}
          }
        },
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
    });
    createdDbs["Ressources et Stocks"] = ressourcesDb.data.id;

    // Créer la base Indicateurs Écologiques avec relation vers Activités
    console.log('Création de la base Indicateurs Écologiques...');
    const indicateursDb = await notion.post('/databases', {
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: "Indicateurs Écologiques" } }],
      properties: {
        Name: { title: {} },
        "Activité/service": {
          type: "relation",
          relation: {
            database_id: activitesDb.data.id,
            single_property: {}
          }
        },
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
    });
    createdDbs["Indicateurs Écologiques"] = indicateursDb.data.id;

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
    
    // Afficher les IDs pour référence
    console.log('\nIDs des bases de données créées :');
    for (const [name, id] of Object.entries(createdDbs)) {
      console.log(`${name}: ${id}`);
    }

  } catch (error) {
    console.error('Erreur:', (error as any).response?.data || error);
    throw error;
  }
}

createDatabases().catch(console.error);
