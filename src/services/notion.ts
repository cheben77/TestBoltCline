import { Client } from '@notionhq/client';
import {
  NotionProduct,
  NotionResponse,
  NotionQueryParams,
  Product
} from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

class NotionService {
  private readonly databaseIds = {
    products: process.env.NOTION_PRODUCTS_DATABASE_ID,
    services: process.env.NOTION_SERVICES_DATABASE_ID,
    events: process.env.NOTION_EVENTS_DATABASE_ID,
  };

  async getProducts(params?: NotionQueryParams): Promise<NotionResponse<Product>> {
    try {
      if (!this.databaseIds.products) {
        throw new Error('Database ID for products not configured');
      }

      const response = await notion.databases.query({
        database_id: this.databaseIds.products,
        ...params,
      });

      const products = response.results.map((result: any) => {
        const notionProduct = result as NotionProduct;
        return {
          id: result.id,
          name: notionProduct.properties.Name.title[0]?.plain_text || '',
          description: notionProduct.properties.Description.rich_text[0]?.plain_text || '',
          price: notionProduct.properties.Price?.number || 0,
          ecoScore: notionProduct.properties.EcoScore?.number || 0,
          benefits: notionProduct.properties.Benefits?.multi_select?.map(b => b.name) || []
        };
      });

      return {
        results: products,
        next_cursor: response.next_cursor || undefined,
        has_more: response.has_more,
      };
    } catch (error) {
      console.error('Error fetching products from Notion:', error);
      throw error;
    }
  }
}

export const notionService = new NotionService();
