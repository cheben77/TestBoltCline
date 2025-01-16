import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

export interface NotionProduct {
  id: string;
  properties: {
    Name: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Description: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Price: {
      number: number;
    };
    EcoScore: {
      number: number;
    };
    Benefits: {
      multi_select: Array<{
        name: string;
      }>;
    };
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  ecoScore: number;
  benefits: string[];
}

export interface NotionResponse<T> {
  results: T[];
  next_cursor?: string;
  has_more: boolean;
}

export type NotionQueryParams = Partial<QueryDatabaseParameters>;

export interface NotionContext {
  type: 'products' | 'services' | 'events';
  data: any[];
}
