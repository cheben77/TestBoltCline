import { Client } from '@notionhq/client';
import { promises as fs } from 'fs';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addTestData() {
  try {
    console.log('Ajout des données de test...');

    // Vérifier les variables d'environnement requises
    const NOTION_PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID;
    const NOTION_SERVICES_DB_ID = process.env.NOTION_SERVICES_DB_ID;
    const NOTION_WORKSHOPS_DB_ID = process.env.NOTION_WORKSHOPS_DB_ID;
    const NOTION_REVIEWS_DB_ID = process.env.NOTION_REVIEWS_DB_ID;
    const NOTION_ECO_IMPACT_DB_ID = process.env.NOTION_ECO_IMPACT_DB_ID;

    if (!NOTION_PRODUCTS_DB_ID || !NOTION_SERVICES_DB_ID || !NOTION_WORKSHOPS_DB_ID || 
        !NOTION_REVIEWS_DB_ID || !NOTION_ECO_IMPACT_DB_ID) {
      throw new Error('Variables d\'environnement manquantes');
    }

    // Ajouter un produit de test
    const product = await notion.pages.create({
      parent: { database_id: NOTION_PRODUCTS_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: 'Huile Essentielle de Lavande Bio' } }],
        },
        Category: {
          select: { name: 'Aromathérapie' },
        },
        Price: { number: 15.99 },
        Stock: { number: 50 },
        Description: {
          rich_text: [{ text: { content: 'Huile essentielle 100% naturelle pour la relaxation et le bien-être' } }],
        },
        EcologicalImpact: {
          rich_text: [{ text: { content: 'Culture biologique, emballage recyclable' } }],
        },
        Benefits: {
          rich_text: [{ text: { content: 'Favorise le sommeil, propriétés apaisantes et relaxantes' } }],
        },
        UsageInstructions: {
          rich_text: [{ text: { content: 'Diluer dans une huile végétale ou diffuser' } }],
        },
        Ingredients: {
          multi_select: [{ name: 'Lavande Bio' }],
        },
        Certifications: {
          multi_select: [{ name: 'Bio' }, { name: 'Ecocert' }],
        },
      },
    });
    console.log('Produit créé:', product.id);

    // Ajouter un service de test
    const service = await notion.pages.create({
      parent: { database_id: NOTION_SERVICES_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: 'Massage Relaxant aux Huiles Essentielles' } }],
        },
        Type: {
          select: { name: 'Bien-être' },
        },
        Duration: { number: 60 },
        Capacity: { number: 1 },
        Location: {
          rich_text: [{ text: { content: 'Centre StoaViva' } }],
        },
        Description: {
          rich_text: [{ text: { content: 'Massage personnalisé utilisant des huiles essentielles bio' } }],
        },
        Benefits: {
          rich_text: [{ text: { content: 'Détente profonde, réduction du stress' } }],
        },
        Price: { number: 75 },
        Instructor: {
          rich_text: [{ text: { content: 'Marie Martin' } }],
        },
        Schedule: {
          rich_text: [{ text: { content: 'Lundi au Samedi, 9h-18h' } }],
        },
        Prerequisites: {
          multi_select: [{ name: 'Aucun' }],
        },
      },
    });
    console.log('Service créé:', service.id);

    // Ajouter un atelier de test
    const workshop = await notion.pages.create({
      parent: { database_id: NOTION_WORKSHOPS_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: 'Initiation à l\'Aromathérapie' } }],
        },
        Date: {
          date: { start: '2024-02-01' },
        },
        Duration: { number: 180 },
        Capacity: { number: 10 },
        Location: {
          rich_text: [{ text: { content: 'Salle Zen - Centre StoaViva' } }],
        },
        Description: {
          rich_text: [{ text: { content: 'Découvrez les bases de l\'aromathérapie et ses bienfaits' } }],
        },
        Price: { number: 45 },
        Instructor: {
          rich_text: [{ text: { content: 'Sophie Dubois' } }],
        },
        Prerequisites: {
          multi_select: [{ name: 'Aucun' }],
        },
        MaterialsIncluded: {
          multi_select: [{ name: 'Guide pratique' }, { name: 'Kit de démarrage' }],
        },
        Status: {
          select: { name: 'Ouvert' },
        },
      },
    });
    console.log('Atelier créé:', workshop.id);

    // Ajouter un avis client de test
    const review = await notion.pages.create({
      parent: { database_id: NOTION_REVIEWS_DB_ID },
      properties: {
        CustomerName: {
          title: [{ text: { content: 'Jean Dupont' } }],
        },
        Rating: { number: 5 },
        ReviewText: {
          rich_text: [{ text: { content: 'Excellent produit, je recommande vivement !' } }],
        },
        Date: {
          date: { start: new Date().toISOString().split('T')[0] },
        },
        Product: {
          relation: [{ id: product.id }],
        },
      },
    });
    console.log('Avis client créé:', review.id);

    // Ajouter une donnée d'impact écologique de test
    const ecoImpact = await notion.pages.create({
      parent: { database_id: NOTION_ECO_IMPACT_DB_ID },
      properties: {
        MetricName: {
          title: [{ text: { content: 'Réduction Emballages' } }],
        },
        Value: { number: 30 },
        Unit: {
          select: { name: 'pourcentage' },
        },
        Date: {
          date: { start: new Date().toISOString().split('T')[0] },
        },
        Category: {
          select: { name: 'Emballage' },
        },
        Description: {
          rich_text: [{ text: { content: 'Réduction des emballages plastiques' } }],
        },
        ImprovementActions: {
          rich_text: [{ text: { content: 'Passage aux emballages recyclables et biodégradables' } }],
        },
      },
    });
    console.log('Impact écologique créé:', ecoImpact.id);

    console.log('Données de test ajoutées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des données de test:', error);
    throw error;
  }
}

// Exécuter le script
addTestData().catch(console.error);
