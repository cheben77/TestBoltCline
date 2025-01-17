const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28'
});

async function testConnection() {
  try {
    console.log('Clé API utilisée:', process.env.NOTION_API_KEY);
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });
    console.log('Bases de données trouvées:', response.results.map((db: any) => ({
      id: db.id,
      title: db.title[0]?.plain_text || 'Sans titre'
    })));
    return true;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}

testConnection().catch(console.error);
