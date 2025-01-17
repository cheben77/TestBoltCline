const { notionService } = require('../services/notion');

async function testNotionService() {
  try {
    console.log('Test de la connexion à Notion...');
    const isConnected = await notionService.testConnection();
    console.log('Connexion à Notion:', isConnected ? 'OK' : 'Échec');

    if (!isConnected) {
      throw new Error('Impossible de se connecter à Notion');
    }

    // Test des activités
    console.log('\nTest des activités...');
    const activity = await notionService.createActivity({
      Name: {
        title: [
          {
            text: {
              content: "Test Activité"
            }
          }
        ]
      },
      Description: {
        rich_text: [
          {
            text: {
              content: "Description de test"
            }
          }
        ]
      },
      Type: {
        select: {
          name: "Atelier"
        }
      },
      "Public cible": {
        multi_select: [
          {
            name: "Solo"
          }
        ]
      },
      Prix: {
        number: 50
      }
    });
    console.log('Activité créée:', activity.id);

    const activities = await notionService.listActivities();
    console.log('Nombre d\'activités:', activities.length);

    // Test des clients
    console.log('\nTest des clients...');
    const client = await notionService.createClient({
      Name: {
        title: [
          {
            text: {
              content: "Client Test"
            }
          }
        ]
      },
      Email: {
        email: "test@example.com"
      },
      "Type de client": {
        select: {
          name: "Solo"
        }
      }
    });
    console.log('Client créé:', client.id);

    const clients = await notionService.listClients();
    console.log('Nombre de clients:', clients.length);

    // Test des ressources
    console.log('\nTest des ressources...');
    const resource = await notionService.createResource({
      Name: {
        title: [
          {
            text: {
              content: "Ressource Test"
            }
          }
        ]
      },
      Catégorie: {
        select: {
          name: "Matériel sportif"
        }
      },
      "Quantité disponible": {
        number: 10
      }
    });
    console.log('Ressource créée:', resource.id);

    const resources = await notionService.listResources();
    console.log('Nombre de ressources:', resources.length);

    // Test des indicateurs
    console.log('\nTest des indicateurs...');
    const indicator = await notionService.createIndicator({
      Name: {
        title: [
          {
            text: {
              content: "Indicateur Test"
            }
          }
        ]
      },
      "Impact carbone": {
        number: 100
      },
      "Score impact": {
        select: {
          name: "Faible"
        }
      }
    });
    console.log('Indicateur créé:', indicator.id);

    const indicators = await notionService.listIndicators();
    console.log('Nombre d\'indicateurs:', indicators.length);

    console.log('\nTous les tests ont réussi !');

  } catch (error) {
    console.error('Erreur lors des tests:', error);
    throw error;
  }
}

testNotionService().catch(console.error);
