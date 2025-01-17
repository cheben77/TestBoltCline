const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
});

async function cleanupDatabases() {
  try {
    console.log('Récupération des bases de données...');
    const response = await notion.post('/search', {
      filter: {
        property: 'object',
        value: 'database'
      }
    });

    const databases = response.data.results;
    const latestDbs = new Map();

    // Garder uniquement la dernière version de chaque base
    databases.forEach((db: any) => {
      const title = db.title[0]?.plain_text;
      if (!title) return;

      // Ne pas toucher aux bases existantes qui ne font pas partie de notre ensemble
      if (!['Activités et Services', 'Clients', 'Partenariats et Fournisseurs', 'Ressources et Stocks', 'Indicateurs Écologiques'].includes(title)) {
        return;
      }

      if (!latestDbs.has(title) || db.id > latestDbs.get(title).id) {
        latestDbs.set(title, db);
      }
    });

    // Supprimer les anciennes versions
    console.log('Suppression des bases de données en double...');
    for (const db of databases) {
      const title = db.title[0]?.plain_text;
      if (!title) continue;

      // Ne pas toucher aux bases qui ne font pas partie de notre ensemble
      if (!['Activités et Services', 'Clients', 'Partenariats et Fournisseurs', 'Ressources et Stocks', 'Indicateurs Écologiques'].includes(title)) {
        continue;
      }

      const latestDb = latestDbs.get(title);
      if (db.id !== latestDb.id) {
        console.log(`Suppression de l'ancienne version de ${title} (${db.id})...`);
        await notion.delete(`/databases/${db.id}`);
      }
    }

    // Mettre à jour .env.local avec les IDs des dernières versions
    const fs = require('fs').promises;
    const envContent = await fs.readFile('.env.local', 'utf8');
    let updatedContent = envContent.split('\n').filter((line: string) => 
      !line.startsWith('NOTION_ACTIVITES_ET_SERVICES_DB_ID') &&
      !line.startsWith('NOTION_CLIENTS_DB_ID') &&
      !line.startsWith('NOTION_PARTENARIATS_ET_FOURNISSEURS_DB_ID') &&
      !line.startsWith('NOTION_RESSOURCES_ET_STOCKS_DB_ID') &&
      !line.startsWith('NOTION_INDICATEURS_ECOLOGIQUES_DB_ID')
    ).join('\n');

    // Ajouter les nouveaux IDs
    for (const [name, db] of latestDbs.entries()) {
      const envKey = `NOTION_${name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DB_ID`;
      updatedContent += `\n${envKey}=${db.id}`;
    }

    await fs.writeFile('.env.local', updatedContent);
    console.log('Fichier .env.local mis à jour avec les IDs des dernières versions');

    console.log('\nBases de données conservées :');
    for (const [name, db] of latestDbs.entries()) {
      console.log(`${name}: ${db.id}`);
    }

  } catch (error) {
    console.error('Erreur:', (error as any).response?.data || error);
    throw error;
  }
}

cleanupDatabases().catch(console.error);
