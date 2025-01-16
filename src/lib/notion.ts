import { Client } from '@notionhq/client';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface NotionProduct {
  id: string;
  name: string;
  category: 'Santé' | 'Nature' | 'Éducation';
  price: number;
  stock: number;
  description: string;
  ecological_impact: string;
}

export interface NotionService {
  id: string;
  name: string;
  type: 'Atelier' | 'Coaching' | 'Formation';
  duration: number;
  capacity: number;
  location: string;
  prerequisites: string[];
}

export async function getProducts(): Promise<NotionProduct[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_PRODUCTS_DB_ID!,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name.title[0]?.plain_text || '',
    category: page.properties.Category.select.name,
    price: page.properties.Price.number,
    stock: page.properties.Stock.number,
    description: page.properties.Description.rich_text[0]?.plain_text || '',
    ecological_impact: page.properties.EcologicalImpact.rich_text[0]?.plain_text || '',
  }));
}

export async function getServices(): Promise<NotionService[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_SERVICES_DB_ID!,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name.title[0]?.plain_text || '',
    type: page.properties.Type.select.name,
    duration: page.properties.Duration.number,
    capacity: page.properties.Capacity.number,
    location: page.properties.Location.rich_text[0]?.plain_text || '',
    prerequisites: page.properties.Prerequisites.multi_select.map((item: any) => item.name),
  }));
}

export async function createTask(title: string, description: string) {
  return await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_TASKS_DB_ID!,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
      Status: {
        select: {
          name: 'À faire',
        },
      },
    },
  });
}
