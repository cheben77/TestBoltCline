import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function listDatabases() {
  try {
    // Liste des produits
    console.log('\n=== Base de données Produits ===');
    const products = await notion.databases.query({
      database_id: process.env.NOTION_PRODUCTS_DB_ID,
    });
    
    products.results.forEach(page => {
      console.log('\nProduit:');
      console.log('- Nom:', page.properties.Name.title[0]?.plain_text);
      console.log('- Catégorie:', page.properties.Category.select?.name);
      console.log('- Prix:', page.properties.Price.number, '€');
      console.log('- Stock:', page.properties.Stock.number);
      console.log('- Description:', page.properties.Description.rich_text[0]?.plain_text);
      console.log('- Impact écologique:', page.properties.EcologicalImpact.rich_text[0]?.plain_text);
    });

    // Liste des services
    console.log('\n=== Base de données Services ===');
    const services = await notion.databases.query({
      database_id: process.env.NOTION_SERVICES_DB_ID,
    });
    
    services.results.forEach(page => {
      console.log('\nService:');
      console.log('- Nom:', page.properties.Name.title[0]?.plain_text);
      console.log('- Type:', page.properties.Type.select?.name);
      console.log('- Durée:', page.properties.Duration.number, 'minutes');
      console.log('- Capacité:', page.properties.Capacity.number, 'personnes');
      console.log('- Lieu:', page.properties.Location.rich_text[0]?.plain_text);
      console.log('- Prérequis:', page.properties.Prerequisites.multi_select.map(p => p.name).join(', '));
    });

    // Liste des tâches
    console.log('\n=== Base de données Tâches ===');
    const tasks = await notion.databases.query({
      database_id: process.env.NOTION_TASKS_DB_ID,
    });
    
    tasks.results.forEach(page => {
      console.log('\nTâche:');
      console.log('- Titre:', page.properties.Name.title[0]?.plain_text);
      console.log('- Statut:', page.properties.Status.select?.name);
      console.log('- Description:', page.properties.Description.rich_text[0]?.plain_text);
      console.log('- Date limite:', page.properties.DueDate?.date?.start || 'Non définie');
      console.log('- Priorité:', page.properties.Priority.select?.name || 'Non définie');
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
}

listDatabases();
