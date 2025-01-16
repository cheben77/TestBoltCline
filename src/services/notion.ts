import { Client } from '@notionhq/client';
import type { 
  NotionRawProduct,
  NotionRawService,
  NotionRawEvent,
  NotionRawContext,
  NotionError,
  QueryResult,
  Product
} from '@/types/notion';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const DATABASES = {
  products: process.env.NOTION_PRODUCTS_DB_ID,
  services: process.env.NOTION_SERVICES_DB_ID,
  events: process.env.NOTION_EVENTS_DB_ID
};

export class NotionService {
  private static instance: NotionService;
  private client: Client;

  private constructor() {
    this.client = notion;
  }

  public static getInstance(): NotionService {
    if (!NotionService.instance) {
      NotionService.instance = new NotionService();
    }
    return NotionService.instance;
  }

  private async queryDatabase(databaseId: string, query?: any) {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...query
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): NotionError {
    const notionError = new Error(error.message) as NotionError;
    notionError.status = error.status;
    notionError.code = error.code;
    notionError.requestId = error.requestId;
    return notionError;
  }

  private transformPageToProduct(page: any): NotionRawProduct {
    const properties = page.properties;
    return {
      id: page.id,
      name: properties.Name.title[0]?.plain_text || '',
      description: properties.Description.rich_text[0]?.plain_text || '',
      price: properties.Price.number || 0,
      category: properties.Category.select?.name || '',
      stock: properties.Stock.number || 0,
      eco_impact: {
        score: properties.EcoScore.number || 0,
        details: properties.EcoDetails.multi_select.map((item: any) => item.name)
      },
      certifications: properties.Certifications.multi_select.map((item: any) => item.name),
      ingredients: properties.Ingredients.multi_select.map((item: any) => item.name),
      benefits: properties.Benefits.multi_select.map((item: any) => item.name),
      usage_instructions: properties.Usage.rich_text[0]?.plain_text || '',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  }

  private transformPageToService(page: any): NotionRawService {
    const properties = page.properties;
    return {
      id: page.id,
      name: properties.Name.title[0]?.plain_text || '',
      description: properties.Description.rich_text[0]?.plain_text || '',
      duration: properties.Duration.number || 0,
      price: properties.Price.number || 0,
      category: properties.Category.select?.name || '',
      capacity: properties.Capacity.number || 0,
      instructor: properties.Instructor.rich_text[0]?.plain_text || '',
      prerequisites: properties.Prerequisites.multi_select.map((item: any) => item.name),
      benefits: properties.Benefits.multi_select.map((item: any) => item.name),
      eco_impact: {
        score: properties.EcoScore.number || 0,
        details: properties.EcoDetails.multi_select.map((item: any) => item.name)
      },
      schedule: {
        days: properties.Days.multi_select.map((item: any) => item.name),
        times: properties.Times.multi_select.map((item: any) => item.name)
      },
      location: properties.Location.rich_text[0]?.plain_text || '',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  }

  private transformPageToEvent(page: any): NotionRawEvent {
    const properties = page.properties;
    return {
      id: page.id,
      title: properties.Title.title[0]?.plain_text || '',
      description: properties.Description.rich_text[0]?.plain_text || '',
      start_date: properties.StartDate.date?.start || '',
      end_date: properties.EndDate.date?.start || '',
      location: properties.Location.rich_text[0]?.plain_text || '',
      capacity: properties.Capacity.number || 0,
      participants: properties.Participants.relation.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        email: item.email || '',
        status: item.status || 'pending'
      })),
      service_id: properties.Service.relation[0]?.id,
      instructor: properties.Instructor.rich_text[0]?.plain_text,
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  }

  public async getProducts(query?: {
    filter?: any;
    sorts?: any[];
    pageSize?: number;
    startCursor?: string;
  }): Promise<QueryResult<Product>> {
    try {
      const response = await this.queryDatabase(DATABASES.products!, {
        filter: query?.filter,
        sorts: query?.sorts,
        page_size: query?.pageSize,
        start_cursor: query?.startCursor
      });

      return {
        results: response.results.map(page => this.transformPageToProduct(page)),
        next_cursor: response.next_cursor,
        has_more: response.has_more
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getContextForQuery(query: string): Promise<NotionRawContext> {
    try {
      // Recherche dans les produits
      const productsResponse = await this.queryDatabase(DATABASES.products!, {
        filter: {
          or: [
            { property: 'Name', rich_text: { contains: query } },
            { property: 'Description', rich_text: { contains: query } },
            { property: 'Category', select: { equals: query } }
          ]
        }
      });

      // Recherche dans les services
      const servicesResponse = await this.queryDatabase(DATABASES.services!, {
        filter: {
          or: [
            { property: 'Name', rich_text: { contains: query } },
            { property: 'Description', rich_text: { contains: query } },
            { property: 'Category', select: { equals: query } }
          ]
        }
      });

      // Recherche dans les événements
      const eventsResponse = await this.queryDatabase(DATABASES.events!, {
        filter: {
          or: [
            { property: 'Title', rich_text: { contains: query } },
            { property: 'Description', rich_text: { contains: query } }
          ]
        }
      });

      return {
        products: productsResponse.results.map(page => this.transformPageToProduct(page)),
        services: servicesResponse.results.map(page => this.transformPageToService(page)),
        events: eventsResponse.results.map(page => this.transformPageToEvent(page)),
        query,
        filters: {
          date: new Date().toISOString()
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const notionService = NotionService.getInstance();
