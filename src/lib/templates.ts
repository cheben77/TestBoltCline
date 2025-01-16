import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface Template {
  id: string;
  name: string;
  description: string;
  language: string;
  template: string;
  isCustom?: boolean;
}

const TEMPLATES_FILE = join(process.cwd(), 'data', 'templates.json');

export const defaultTemplates: Template[] = [
  {
    id: 'notion-sync',
    name: 'Synchronisation Notion',
    description: 'Synchronise des données avec une base Notion',
    language: 'typescript',
    template: `import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = 'your-database-id';

async function syncData() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    // Traitement des données
    const items = response.results.map(page => ({
      // Mappez vos champs ici
    }));
    
    return items;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}`
  },
  // ... autres templates par défaut
];

export async function loadTemplates(): Promise<Template[]> {
  try {
    const content = await readFile(TEMPLATES_FILE, 'utf-8');
    const customTemplates = JSON.parse(content);
    return [...defaultTemplates, ...customTemplates];
  } catch (error) {
    // Si le fichier n'existe pas, retourner les templates par défaut
    return defaultTemplates;
  }
}

export async function saveTemplate(template: Template): Promise<void> {
  try {
    const templates = await loadTemplates();
    const customTemplates = templates.filter(t => t.isCustom);
    
    // Ajouter ou mettre à jour le template
    const existingIndex = customTemplates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      customTemplates[existingIndex] = { ...template, isCustom: true };
    } else {
      customTemplates.push({ ...template, isCustom: true });
    }
    
    await writeFile(TEMPLATES_FILE, JSON.stringify(customTemplates, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du template:', error);
    throw error;
  }
}

export async function deleteTemplate(templateId: string): Promise<void> {
  try {
    const templates = await loadTemplates();
    const customTemplates = templates.filter(t => t.isCustom && t.id !== templateId);
    await writeFile(TEMPLATES_FILE, JSON.stringify(customTemplates, null, 2));
  } catch (error) {
    console.error('Erreur lors de la suppression du template:', error);
    throw error;
  }
}
