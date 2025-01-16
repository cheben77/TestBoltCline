import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const testProducts = [
  {
    name: 'Kit de Bivouac Nature',
    category: 'Nature',
    price: 149.99,
    stock: 10,
    description: 'Kit complet pour une expérience de bivouac en pleine nature. Inclut une tente légère, un sac de couchage écologique et des ustensiles réutilisables.',
    ecological_impact: 'Matériaux recyclés et durables, emballage minimal, compensation carbone incluse'
  },
  {
    name: 'Pack Bien-être Essentiel',
    category: 'Santé',
    price: 79.99,
    stock: 15,
    description: 'Collection d\'huiles essentielles bio, diffuseur en bambou et guide de méditation.',
    ecological_impact: 'Produits 100% biologiques, packaging biodégradable'
  },
  {
    name: 'Guide Éducatif Nature',
    category: 'Éducation',
    price: 29.99,
    stock: 25,
    description: 'Guide illustré pour découvrir et comprendre la nature locale. Parfait pour les familles et les écoles.',
    ecological_impact: 'Papier recyclé, encres végétales, impression locale'
  }
];

async function addTestProducts() {
  try {
    for (const product of testProducts) {
      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_PRODUCTS_DB_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: product.name,
                },
              },
            ],
          },
          Category: {
            select: {
              name: product.category,
            },
          },
          Price: {
            number: product.price,
          },
          Stock: {
            number: product.stock,
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: product.description,
                },
              },
            ],
          },
          EcologicalImpact: {
            rich_text: [
              {
                text: {
                  content: product.ecological_impact,
                },
              },
            ],
          },
        },
      });
      console.log(`Produit ajouté: ${product.name}`);
    }
    console.log('\nTous les produits de test ont été ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des produits:', error);
  }
}

addTestProducts();
