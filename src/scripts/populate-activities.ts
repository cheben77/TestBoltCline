const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ACTIVITIES_DB_ID = process.env.NOTION_ACTIVITIES_DB_ID;

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
});

const activities = [
  {
    name: "Kit Solo",
    categorie: "Activités Principales",
    sousCategorie: "Kits d'expérience",
    activitesOffres: "stretching, randonnée/VTT, atelier de survie/bivouac",
    objectifs: "Favoriser l'autonomie et le bien-être individuel",
    ressourcesNecessaires: "Matériel de bivouac, VTT, tapis de stretching",
    responsables: ["Yannick", "Anthony"],
    status: "En préparation",
    impact: "Faible"
  },
  {
    name: "Kit Famille",
    categorie: "Activités Principales",
    sousCategorie: "Kits d'expérience",
    activitesOffres: "bivouac éducatif, activités pour enfants (Explorateur en Herbe), randonnée",
    objectifs: "Éducation ludique, cohésion familiale",
    ressourcesNecessaires: "Kits nature pour enfants, matériel pédagogique",
    responsables: ["Yannick"],
    status: "En préparation",
    impact: "Faible"
  },
  {
    name: "Kit Couples",
    categorie: "Activités Principales",
    sousCategorie: "Kits d'expérience",
    activitesOffres: "dîner privé, activités relaxantes en duo, randonnée romantique",
    objectifs: "Renforcer les liens du couple dans un cadre naturel",
    ressourcesNecessaires: "Tapis pour deux, accessoires romantiques",
    responsables: ["Yannick"],
    status: "En préparation",
    impact: "Faible"
  },
  {
    name: "Escape game nature",
    categorie: "Activités Annexes",
    sousCategorie: "Nature et Bien-être",
    activitesOffres: "Escape game en pleine nature",
    objectifs: "Activité ludique adaptée à différents publics",
    ressourcesNecessaires: "Matériel de scénarios et énigmes",
    responsables: ["Yannick"],
    status: "En préparation",
    impact: "Faible"
  },
  {
    name: "Ateliers pédagogiques",
    categorie: "Services Éducatifs",
    sousCategorie: "Ateliers pédagogiques",
    activitesOffres: "Ateliers de survie, permaculture, agroécologie",
    objectifs: "Transmettre des savoirs utiles et écoresponsables",
    ressourcesNecessaires: "Matériel pédagogique, terrain",
    responsables: ["Yannick", "Agroforestier"],
    status: "En préparation",
    impact: "Faible"
  }
];

async function createPage(activity: any) {
  try {
    const response = await notion.post('/pages', {
      parent: { database_id: ACTIVITIES_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: activity.name } }]
        },
        Categorie: {
          select: { name: activity.categorie }
        },
        'Sous-Categorie': {
          select: { name: activity.sousCategorie }
        },
        'Activités/Offres': {
          rich_text: [{ text: { content: activity.activitesOffres } }]
        },
        Objectifs: {
          rich_text: [{ text: { content: activity.objectifs } }]
        },
        'Ressources Nécessaires': {
          rich_text: [{ text: { content: activity.ressourcesNecessaires } }]
        },
        'Responsables/Collaborateurs': {
          multi_select: activity.responsables.map((name: string) => ({ name }))
        },
        Status: {
          select: { name: activity.status }
        },
        'Impact écologique': {
          select: { name: activity.impact }
        }
      }
    });

    console.log(`Activité créée: ${activity.name}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la création de ${activity.name}:`, (error as any).response?.data || error);
    throw error;
  }
}

async function populateDatabase() {
  console.log('Ajout des activités dans la base de données...');
  
  for (const activity of activities) {
    await createPage(activity);
  }
  
  console.log('Base de données peuplée avec succès !');
}

populateDatabase().catch(console.error);
