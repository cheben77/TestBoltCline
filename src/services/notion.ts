import { Client } from '@notionhq/client';
import { mockEcologicalImpact, mockProducts, mockPersons, mockServices } from '@/data/mockData';

const isDev = process.env.NODE_ENV === 'development';

interface Person {
  id: string;
  name: string;
  age: number;
  interests: string[];
  email: string;
  phone: string;
  status: string;
  last_contact: string;
  notes: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  ecological_impact: string;
  benefits: string;
  usage_instructions: string;
  ingredients: string[];
  certifications: string[];
}

interface Service {
  id: string;
  name: string;
  type: string;
  duration: number;
  capacity: number;
  location: string;
  description: string;
  benefits: string;
  price: number;
  instructor: string;
  schedule: string;
  prerequisites: string[];
  difficulty_level?: 'débutant' | 'intermédiaire' | 'avancé';
}

interface EcoImpact {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  date: string;
  category: string;
  description: string;
  improvement_actions: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location?: string;
  description?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

class NotionServiceManager {
  private static instance: NotionServiceManager;
  private client: Client;
  private cache: {
    products?: Product[];
    services?: Service[];
    ecoImpact?: EcoImpact[];
    persons?: Person[];
    databases?: Array<{name: string; id: string; properties: any}>;
    lastUpdate: {
      products?: Date;
      services?: Date;
      ecoImpact?: Date;
      persons?: Date;
      databases?: Date;
    };
  };

  private constructor() {
    if (!isDev && !process.env.NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY is not defined');
    }
    
    this.client = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    this.cache = { lastUpdate: {} };
  }

  public static getInstance(): NotionServiceManager {
    if (!NotionServiceManager.instance) {
      NotionServiceManager.instance = new NotionServiceManager();
    }
    return NotionServiceManager.instance;
  }

  private shouldRefreshCache(key: string): boolean {
    const lastUpdate = this.cache.lastUpdate[key as keyof typeof this.cache.lastUpdate];
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate.getTime() > 5 * 60 * 1000;
  }

  private validateDatabaseId(databaseId: string | undefined, name: string): string {
    if (!databaseId) {
      throw new Error(`${name} is not defined in environment variables`);
    }
    return databaseId;
  }

  async getDatabases(): Promise<Array<{name: string; id: string; properties: any}>> {
    if (isDev) {
      return [
        { 
          name: "Services", 
          id: "serv_db",
          properties: {
            Name: { type: 'title', title: {} },
            Duration: { type: 'number', number: { format: 'minute' } },
            Price: { type: 'number', number: { format: 'euro' } },
            DifficultyLevel: { 
              type: 'select',
              select: {
                options: [
                  { name: 'débutant', color: 'green' },
                  { name: 'intermédiaire', color: 'yellow' },
                  { name: 'avancé', color: 'red' }
                ]
              }
            }
          }
        }
      ];
    }

    try {
      if (this.cache.databases && !this.shouldRefreshCache('databases')) {
        return this.cache.databases;
      }

      const response = await this.client.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      const databases = response.results.map((db: any) => ({
        name: db.title[0]?.plain_text || 'Sans titre',
        id: db.id,
        properties: db.properties
      }));

      this.cache.databases = databases;
      this.cache.lastUpdate.databases = new Date();

      return databases;
    } catch (error) {
      console.error('Erreur lors de la récupération des bases de données:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    if (isDev) {
      return mockProducts;
    }

    try {
      if (this.cache.products && !this.shouldRefreshCache('products')) {
        return this.cache.products;
      }

      const databaseId = this.validateDatabaseId(
        process.env.NOTION_PRODUCTS_DB_ID,
        'NOTION_PRODUCTS_DB_ID'
      );

      const response = await this.client.databases.query({
        database_id: databaseId,
      });

      const products = response.results.map((page: any) => ({
        id: page.id,
        name: page.properties.Name?.title[0]?.plain_text || '',
        category: page.properties.Category?.select?.name || '',
        price: page.properties.Price?.number || 0,
        stock: page.properties.Stock?.number || 0,
        description: page.properties.Description?.rich_text[0]?.plain_text || '',
        ecological_impact: page.properties.EcologicalImpact?.rich_text[0]?.plain_text || '',
        benefits: page.properties.Benefits?.rich_text[0]?.plain_text || '',
        usage_instructions: page.properties.UsageInstructions?.rich_text[0]?.plain_text || '',
        ingredients: (page.properties.Ingredients?.multi_select || []).map((item: any) => item.name),
        certifications: (page.properties.Certifications?.multi_select || []).map((item: any) => item.name),
      }));

      this.cache.products = products;
      this.cache.lastUpdate.products = new Date();

      return products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase())) ||
      product.benefits.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getServices(): Promise<Service[]> {
    if (isDev) {
      return mockServices;
    }

    try {
      if (this.cache.services && !this.shouldRefreshCache('services')) {
        return this.cache.services;
      }

      const databaseId = this.validateDatabaseId(
        process.env.NOTION_SERVICES_DB_ID,
        'NOTION_SERVICES_DB_ID'
      );

      const response = await this.client.databases.query({
        database_id: databaseId,
      });

      const services = response.results.map((page: any) => ({
        id: page.id,
        name: page.properties.Name?.title[0]?.plain_text || '',
        type: page.properties.Type?.select?.name || '',
        duration: page.properties.Duration?.number || 0,
        capacity: page.properties.Capacity?.number || 0,
        location: page.properties.Location?.rich_text[0]?.plain_text || '',
        description: page.properties.Description?.rich_text[0]?.plain_text || '',
        benefits: page.properties.Benefits?.rich_text[0]?.plain_text || '',
        price: page.properties.Price?.number || 0,
        instructor: page.properties.Instructor?.rich_text[0]?.plain_text || '',
        schedule: page.properties.Schedule?.rich_text[0]?.plain_text || '',
        prerequisites: (page.properties.Prerequisites?.multi_select || []).map((item: any) => item.name),
        difficulty_level: page.properties.DifficultyLevel?.select?.name
      }));

      this.cache.services = services;
      this.cache.lastUpdate.services = new Date();

      return services;
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      throw error;
    }
  }

  async searchServices(query: string): Promise<Service[]> {
    const services = await this.getServices();
    return services.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase()) ||
      service.type.toLowerCase().includes(query.toLowerCase()) ||
      service.location.toLowerCase().includes(query.toLowerCase()) ||
      service.benefits.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getCalendarEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    if (isDev) {
      return [
        {
          id: 'evt1',
          title: 'Atelier Bien-être',
          start_date: '2024-01-20T10:00:00Z',
          end_date: '2024-01-20T12:00:00Z',
          location: 'Salle Zen',
          description: 'Atelier de méditation et relaxation',
          status: 'scheduled'
        }
      ];
    }

    try {
      const databaseId = this.validateDatabaseId(
        process.env.NOTION_CALENDAR_DB_ID,
        'NOTION_CALENDAR_DB_ID'
      );

      const filter: any = {
        and: [
          {
            property: 'Date',
            date: {
              is_not_empty: true
            }
          }
        ]
      };

      if (startDate) {
        filter.and.push({
          property: 'Date',
          date: {
            on_or_after: startDate.toISOString()
          }
        });
      }

      if (endDate) {
        filter.and.push({
          property: 'Date',
          date: {
            on_or_before: endDate.toISOString()
          }
        });
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: filter,
        sorts: [
          {
            property: 'Date',
            direction: 'ascending'
          }
        ]
      });

      return response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || '',
        start_date: page.properties.Date?.date?.start || '',
        end_date: page.properties.Date?.date?.end || page.properties.Date?.date?.start || '',
        location: page.properties.Location?.rich_text[0]?.plain_text || '',
        description: page.properties.Description?.rich_text[0]?.plain_text || '',
        status: page.properties.Status?.select?.name || 'scheduled'
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }

  async getDatabaseSchema(database_id: string): Promise<any> {
    if (isDev) {
      return {
        properties: {
          Name: { type: 'title', title: {} },
          Description: { type: 'rich_text', rich_text: {} }
        }
      };
    }

    try {
      const response = await this.client.databases.retrieve({
        database_id: database_id
      });
      return {
        properties: response.properties
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du schéma:', error);
      throw error;
    }
  }

  async updateDatabase(params: {
    database_id: string;
    title?: string;
    properties?: Record<string, any>;
  }): Promise<any> {
    if (isDev) {
      return {
        id: params.database_id,
        title: params.title,
        properties: params.properties
      };
    }

    try {
      const updateParams: any = { database_id: params.database_id };
      if (params.title) {
        updateParams.title = [{ type: 'text', text: { content: params.title } }];
      }
      if (params.properties) {
        updateParams.properties = params.properties;
      }

      const response = await this.client.databases.update(updateParams);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la base de données:', error);
      throw error;
    }
  }

  async addDatabaseProperty(params: {
    database_id: string;
    property_name: string;
    property_config: any;
  }): Promise<any> {
    if (isDev) {
      const services = mockServices;
      services.forEach((service: Service) => {
        if (params.property_config.type === 'select') {
          (service as any)[params.property_name] = params.property_config.select.options[0].name;
        } else {
          (service as any)[params.property_name] = null;
        }
      });
      return {
        id: params.database_id,
        properties: {
          [params.property_name]: params.property_config
        }
      };
    }

    try {
      const currentSchema = await this.getDatabaseSchema(params.database_id);
      const updatedProperties = {
        ...currentSchema.properties,
        [params.property_name]: params.property_config
      };

      const result = await this.updateDatabase({
        database_id: params.database_id,
        properties: updatedProperties
      });

      // Mettre à jour tous les enregistrements existants avec la nouvelle propriété
      const pages = await this.client.databases.query({
        database_id: params.database_id
      });

      for (const page of pages.results) {
        const updateData: any = {
          page_id: page.id,
          properties: {
            [params.property_name]: {
              [params.property_config.type]: params.property_config.type === 'select' ? 
                { name: params.property_config.select.options[0].name } : 
                null
            }
          }
        };
        await this.client.pages.update(updateData);
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la propriété:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getDatabases();
      return true;
    } catch (error) {
      console.error('Erreur de connexion à Notion:', error);
      return false;
    }
  }

  async getContextForQuery(query: string) {
    try {
      const [products, services, events] = await Promise.all([
        this.searchProducts(query),
        this.searchServices(query),
        this.getCalendarEvents(),
      ]);

      // Si le message concerne la personnalisation de la base de données
      if (query.toLowerCase().includes('personnaliser') && query.toLowerCase().includes('base de données')) {
        const databases = await this.getDatabases();
        return {
          databases,
          query
        };
      }

      // Ajouter les informations de disponibilité
      const servicesWithAvailability = services.map((service: Service) => ({
        ...service,
        availability: isDev ? [
          {
            day: 'Lundi',
            time: '18h',
            available: true
          },
          {
            day: 'Mercredi',
            time: '18h',
            available: true
          }
        ] : events
          .filter(e => e.title === service.name)
          .map(e => ({
            day: new Date(e.start_date).toLocaleDateString('fr-FR', { weekday: 'long' }),
            time: new Date(e.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            available: e.status === 'scheduled'
          }))
      }));

      return {
        products,
        services: servicesWithAvailability,
        events,
        query,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du contexte:', error);
      throw error;
    }
  }
}

export const notionService = NotionServiceManager.getInstance();
