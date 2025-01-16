const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function createDatabases() {
  try {
    // Créer la base de données des produits
    const productsDb = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: '177151e8ba2980d2a6a5c8f768ec85e4',
      },
      title: [
        {
          type: 'text',
          text: { content: 'Produits StoaViva' },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Category: {
          select: {
            options: [
              { name: 'Santé', color: 'green' },
              { name: 'Nature', color: 'blue' },
              { name: 'Éducation', color: 'orange' },
            ],
          },
        },
        Price: {
          number: {
            format: 'euro',
          },
        },
        Stock: {
          number: {
            format: 'number',
          },
        },
        Description: {
          rich_text: {},
        },
        EcologicalImpact: {
          rich_text: {},
        },
      },
    });
    console.log('Base de données des produits créée:', productsDb.id);

    // Créer la base de données des services
    const servicesDb = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: '177151e8ba2980d2a6a5c8f768ec85e4',
      },
      title: [
        {
          type: 'text',
          text: { content: 'Services StoaViva' },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Type: {
          select: {
            options: [
              { name: 'Atelier', color: 'blue' },
              { name: 'Coaching', color: 'green' },
              { name: 'Formation', color: 'orange' },
            ],
          },
        },
        Duration: {
          number: {
            format: 'number',
          },
        },
        Capacity: {
          number: {
            format: 'number',
          },
        },
        Location: {
          rich_text: {},
        },
        Prerequisites: {
          multi_select: {
            options: [
              { name: 'Aucun', color: 'gray' },
              { name: 'Matériel spécifique', color: 'blue' },
              { name: 'Expérience requise', color: 'red' },
            ],
          },
        },
      },
    });
    console.log('Base de données des services créée:', servicesDb.id);

    // Créer la base de données des tâches
    const tasksDb = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: '177151e8ba2980d2a6a5c8f768ec85e4',
      },
      title: [
        {
          type: 'text',
          text: { content: 'Tâches StoaViva' },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Status: {
          select: {
            options: [
              { name: 'À faire', color: 'red' },
              { name: 'En cours', color: 'yellow' },
              { name: 'Terminé', color: 'green' },
            ],
          },
        },
        Description: {
          rich_text: {},
        },
        DueDate: {
          date: {},
        },
        Priority: {
          select: {
            options: [
              { name: 'Basse', color: 'gray' },
              { name: 'Moyenne', color: 'yellow' },
              { name: 'Haute', color: 'red' },
            ],
          },
        },
      },
    });
    console.log('Base de données des tâches créée:', tasksDb.id);

    console.log('\nConfiguration terminée! Mettez à jour votre .env.local avec ces IDs:');
    console.log(`NOTION_PRODUCTS_DB_ID=${productsDb.id}`);
    console.log(`NOTION_SERVICES_DB_ID=${servicesDb.id}`);
    console.log(`NOTION_TASKS_DB_ID=${tasksDb.id}`);

  } catch (error) {
    console.error('Erreur lors de la création des bases de données:', error);
  }
}

createDatabases();
