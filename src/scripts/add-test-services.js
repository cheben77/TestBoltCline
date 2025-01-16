const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const testServices = [
  {
    name: 'Atelier Découverte Nature',
    type: 'Atelier',
    duration: 180,
    capacity: 12,
    location: 'Forêt de Fontainebleau',
    prerequisites: ['Matériel spécifique']
  },
  {
    name: 'Coaching Bien-être Personnel',
    type: 'Coaching',
    duration: 60,
    capacity: 1,
    location: 'En ligne ou en présentiel',
    prerequisites: ['Aucun']
  },
  {
    name: 'Formation Guide Nature',
    type: 'Formation',
    duration: 480,
    capacity: 8,
    location: 'Centre de formation StoaViva',
    prerequisites: ['Expérience requise']
  }
];

async function addTestServices() {
  try {
    for (const service of testServices) {
      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_SERVICES_DB_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: service.name,
                },
              },
            ],
          },
          Type: {
            select: {
              name: service.type,
            },
          },
          Duration: {
            number: service.duration,
          },
          Capacity: {
            number: service.capacity,
          },
          Location: {
            rich_text: [
              {
                text: {
                  content: service.location,
                },
              },
            ],
          },
          Prerequisites: {
            multi_select: service.prerequisites.map(p => ({ name: p })),
          },
        },
      });
      console.log(`Service ajouté: ${service.name}`);
    }
    console.log('\nTous les services de test ont été ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des services:', error);
  }
}

addTestServices();
