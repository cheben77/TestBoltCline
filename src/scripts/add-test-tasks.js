const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const testTasks = [
  {
    name: 'Préparer le matériel atelier nature',
    description: 'Rassembler et vérifier tout le matériel nécessaire pour l\'atelier découverte nature',
    status: 'À faire',
    priority: 'Haute',
    dueDate: '2024-02-15'
  },
  {
    name: 'Mise à jour catalogue produits',
    description: 'Ajouter les nouveaux produits écologiques au catalogue et mettre à jour les prix',
    status: 'En cours',
    priority: 'Moyenne',
    dueDate: '2024-02-10'
  },
  {
    name: 'Formation nouveaux guides',
    description: 'Organiser la session de formation pour les nouveaux guides nature',
    status: 'À faire',
    priority: 'Haute',
    dueDate: '2024-02-20'
  }
];

async function addTestTasks() {
  try {
    for (const task of testTasks) {
      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_TASKS_DB_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: task.name,
                },
              },
            ],
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: task.description,
                },
              },
            ],
          },
          Status: {
            select: {
              name: task.status,
            },
          },
          Priority: {
            select: {
              name: task.priority,
            },
          },
          DueDate: {
            date: {
              start: task.dueDate,
            },
          },
        },
      });
      console.log(`Tâche ajoutée: ${task.name}`);
    }
    console.log('\nToutes les tâches de test ont été ajoutées avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des tâches:', error);
  }
}

addTestTasks();
