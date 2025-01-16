const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addTestPersons() {
  try {
    console.log('Ajout des personnes de test...');

    const testPersons = [
      {
        Name: { title: [{ text: { content: 'Sophie Martin' } }] },
        Age: { number: 34 },
        Email: { email: 'sophie.martin@example.com' },
        Phone: { phone_number: '+33612345678' },
        Status: { select: { name: 'Client' } },
        Interests: { multi_select: [{ name: 'Bien-être' }, { name: 'Méditation' }] },
        LastContact: { date: { start: '2024-01-10' } },
        Notes: { rich_text: [{ text: { content: 'Intéressée par les ateliers de méditation' } }] },
      },
      {
        Name: { title: [{ text: { content: 'Thomas Dubois' } }] },
        Age: { number: 28 },
        Email: { email: 'thomas.dubois@example.com' },
        Phone: { phone_number: '+33623456789' },
        Status: { select: { name: 'Prospect' } },
        Interests: { multi_select: [{ name: 'Écologie' }, { name: 'Aromathérapie' }] },
        LastContact: { date: { start: '2024-01-12' } },
        Notes: { rich_text: [{ text: { content: 'A demandé des informations sur les produits écologiques' } }] },
      },
      {
        Name: { title: [{ text: { content: 'Marie Petit' } }] },
        Age: { number: 42 },
        Email: { email: 'marie.petit@example.com' },
        Phone: { phone_number: '+33634567890' },
        Status: { select: { name: 'Client' } },
        Interests: { multi_select: [{ name: 'Yoga' }, { name: 'Bien-être' }, { name: 'Écologie' }] },
        LastContact: { date: { start: '2024-01-15' } },
        Notes: { rich_text: [{ text: { content: 'Participe régulièrement aux ateliers de yoga' } }] },
      },
      {
        Name: { title: [{ text: { content: 'Lucas Bernard' } }] },
        Age: { number: 31 },
        Email: { email: 'lucas.bernard@example.com' },
        Phone: { phone_number: '+33645678901' },
        Status: { select: { name: 'Inactif' } },
        Interests: { multi_select: [{ name: 'Aromathérapie' }] },
        LastContact: { date: { start: '2023-12-01' } },
        Notes: { rich_text: [{ text: { content: 'N\'a pas répondu aux derniers contacts' } }] },
      },
      {
        Name: { title: [{ text: { content: 'Emma Roux' } }] },
        Age: { number: 39 },
        Email: { email: 'emma.roux@example.com' },
        Phone: { phone_number: '+33656789012' },
        Status: { select: { name: 'Client' } },
        Interests: { multi_select: [{ name: 'Méditation' }, { name: 'Yoga' }, { name: 'Écologie' }] },
        LastContact: { date: { start: '2024-01-14' } },
        Notes: { rich_text: [{ text: { content: 'Très engagée dans les activités de bien-être' } }] },
      },
    ];

    for (const person of testPersons) {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_PUBLICS_DB_ID },
        properties: person,
      });
      console.log(`Personne ajoutée : ${person.Name.title[0].text.content}`);
    }

    console.log('Toutes les personnes de test ont été ajoutées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des personnes de test:', error);
    throw error;
  }
}

// Exécuter le script
addTestPersons().catch(console.error);
