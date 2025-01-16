const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addTestData() {
  try {
    // Ajouter des produits de test
    const products = [
      {
        Name: { title: [{ text: { content: 'Savon Bio' } }] },
        Category: { select: { name: 'Santé' } },
        Price: { number: 8.99 },
        Stock: { number: 50 },
        Description: { rich_text: [{ text: { content: 'Savon naturel fait à la main avec des ingrédients bio' } }] },
        EcologicalImpact: { rich_text: [{ text: { content: 'Emballage biodégradable, ingrédients locaux' } }] }
      },
      {
        Name: { title: [{ text: { content: 'Shampoing Solide' } }] },
        Category: { select: { name: 'Santé' } },
        Price: { number: 12.99 },
        Stock: { number: 30 },
        Description: { rich_text: [{ text: { content: 'Shampoing solide zéro déchet aux huiles essentielles' } }] },
        EcologicalImpact: { rich_text: [{ text: { content: 'Zéro déchet, formule naturelle' } }] }
      }
    ];

    for (const product of products) {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_PRODUCTS_DB_ID },
        properties: product
      });
      console.log(`Produit ajouté: ${product.Name.title[0].text.content}`);
    }

    // Ajouter des services de test
    const services = [
      {
        Name: { title: [{ text: { content: 'Atelier Zéro Déchet' } }] },
        Type: { select: { name: 'Atelier' } },
        Duration: { number: 120 },
        Capacity: { number: 10 },
        Location: { rich_text: [{ text: { content: 'En ligne' } }] },
        Prerequisites: { multi_select: [{ name: 'Aucun' }] }
      },
      {
        Name: { title: [{ text: { content: 'Coaching Bien-être' } }] },
        Type: { select: { name: 'Coaching' } },
        Duration: { number: 60 },
        Capacity: { number: 1 },
        Location: { rich_text: [{ text: { content: 'À domicile' } }] },
        Prerequisites: { multi_select: [{ name: 'Aucun' }] }
      }
    ];

    for (const service of services) {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_SERVICES_DB_ID },
        properties: service
      });
      console.log(`Service ajouté: ${service.Name.title[0].text.content}`);
    }

    console.log('Données de test ajoutées avec succès !');

  } catch (error) {
    console.error('Erreur lors de l\'ajout des données:', error);
  }
}

addTestData();
