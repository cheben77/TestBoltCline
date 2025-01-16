import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function listDatabases() {
  try {
    console.log('Recherche des bases de données...');
    
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });

    console.log('\nBases de données trouvées :');
    response.results.forEach((db: any) => {
      const name = db.title[0]?.plain_text || 'Sans titre';
      console.log(`- ${name} (${db.id})`);
      
      // Afficher plus de détails pour la base "publics"
      if (name.toLowerCase().includes('public')) {
        console.log('\nDétails de la base "publics" :');
        console.log('ID:', db.id);
        console.log('Propriétés:');
        Object.entries(db.properties).forEach(([key, value]: [string, any]) => {
          console.log(`  - ${key} (${value.type})`);
        });
      }
    });

  } catch (error) {
    console.error('Erreur lors de la recherche des bases de données:', error);
  }
}

// Exécuter le script
listDatabases();
