const { Client } = require('@notionhq/client');
const fs = require('fs').promises;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28'
});

async function createDatabases() {
  try {
    console.log('Création des bases de données...');

    // Créer la base de données des personnes
    const personsDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Personnes StoaViva' } }],
      properties: {
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
      },
    });
    console.log('Base de données des personnes créée:', personsDb.id);
    process.env.NOTION_PUBLICS_DB_ID = personsDb.id;

    // Créer la base de données des produits
    const productsDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Produits StoaViva' } }],
      properties: {
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
      },
    });
    console.log('Base de données des produits créée:', productsDb.id);
    process.env.NOTION_PRODUCTS_DB_ID = productsDb.id;

    // Créer la base de données des services
    const servicesDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Services StoaViva' } }],
      properties: {
        Name: { title: {} },
        Type: { select: { options: [{ name: 'Bien-être' }, { name: 'Coaching' }] } },
        Duration: { number: {} },
        Capacity: { number: {} },
        Location: { rich_text: {} },
        Description: { rich_text: {} },
        Benefits: { rich_text: {} },
        Price: { number: {} },
        Instructor: { rich_text: {} },
        Schedule: { rich_text: {} },
        Prerequisites: { multi_select: {} },
      },
    });
    console.log('Base de données des services créée:', servicesDb.id);
    process.env.NOTION_SERVICES_DB_ID = servicesDb.id;

    // Créer la base de données des ateliers
    const workshopsDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Ateliers StoaViva' } }],
      properties: {
        Name: { title: {} },
        Date: { date: {} },
        Duration: { number: {} },
        Capacity: { number: {} },
        Location: { rich_text: {} },
        Description: { rich_text: {} },
        Price: { number: {} },
        Instructor: { rich_text: {} },
        Prerequisites: { multi_select: {} },
        MaterialsIncluded: { multi_select: {} },
        Status: { select: { options: [{ name: 'Ouvert' }, { name: 'Complet' }] } },
      },
    });
    console.log('Base de données des ateliers créée:', workshopsDb.id);
    process.env.NOTION_WORKSHOPS_DB_ID = workshopsDb.id;

    // Créer la base de données des avis clients
    const reviewsDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Avis Clients StoaViva' } }],
      properties: {
        CustomerName: { title: {} },
        Rating: { number: {} },
        ReviewText: { rich_text: {} },
        Date: { date: {} },
        Product: { 
          relation: { 
            single_property: {},
            database_id: productsDb.id 
          } 
        },
      },
    });
    console.log('Base de données des avis créée:', reviewsDb.id);
    process.env.NOTION_REVIEWS_DB_ID = reviewsDb.id;

    // Créer la base de données de l'impact écologique
    const ecoImpactDb = await notion.databases.create({
      parent: { page_id: '177151e8ba2980d2a6a5c8f768ec85e4' },
      title: [{ text: { content: 'Impact Écologique StoaViva' } }],
      properties: {
        MetricName: { title: {} },
        Value: { number: {} },
        Unit: { select: { options: [{ name: 'pourcentage' }, { name: 'kg' }] } },
        Date: { date: {} },
        Category: { select: { options: [{ name: 'Emballage' }, { name: 'Énergie' }] } },
        Description: { rich_text: {} },
        ImprovementActions: { rich_text: {} },
      },
    });
    console.log('Base de données de l\'impact écologique créée:', ecoImpactDb.id);
    process.env.NOTION_ECO_IMPACT_DB_ID = ecoImpactDb.id;

    // Mettre à jour le fichier .env.local avec les nouveaux IDs
    const envContent = `# Notion API Configuration
NOTION_API_KEY=${process.env.NOTION_API_KEY}

# Notion Database IDs
NOTION_PUBLICS_DB_ID=${personsDb.id}
NOTION_PRODUCTS_DB_ID=${productsDb.id}
NOTION_SERVICES_DB_ID=${servicesDb.id}
NOTION_WORKSHOPS_DB_ID=${workshopsDb.id}
NOTION_REVIEWS_DB_ID=${reviewsDb.id}
NOTION_ECO_IMPACT_DB_ID=${ecoImpactDb.id}

# Ollama Configuration
OLLAMA_ENDPOINT=http://127.0.0.1:11434/api

# Autres configurations
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development`;

    await fs.writeFile('.env.local', envContent);
    console.log('Fichier .env.local mis à jour avec les nouveaux IDs');

    return {
      personsDb,
      productsDb,
      servicesDb,
      workshopsDb,
      reviewsDb,
      ecoImpactDb,
    };
  } catch (error) {
    console.error('Erreur lors de la création des bases de données:', error);
    throw error;
  }
}

// Exécuter le script
createDatabases().catch(console.error);
