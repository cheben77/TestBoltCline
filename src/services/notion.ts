const { Client } = require('@notionhq/client');
const { APIResponseError } = require('@notionhq/client/build/src/errors');
const { PageObjectResponse } = require('@notionhq/client/build/src/api-endpoints');

class NotionService {
  private client;
  private databaseIds;

  constructor(config) {
    this.client = new Client({ auth: config.apiKey });
    this.databaseIds = config.databaseIds;
  }

  // Méthodes génériques CRUD
  async createPage(databaseId, properties) {
    try {
      return await this.client.pages.create({
        parent: { database_id: databaseId },
        properties
      });
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur Notion API:', error.message);
      }
      throw error;
    }
  }

  async updatePage(pageId, properties) {
    try {
      return await this.client.pages.update({
        page_id: pageId,
        properties
      });
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur Notion API:', error.message);
      }
      throw error;
    }
  }

  async getPage(pageId) {
    try {
      return await this.client.pages.retrieve({
        page_id: pageId
      });
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur Notion API:', error.message);
      }
      throw error;
    }
  }

  async queryDatabase(databaseId, filter) {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter
      });
      return response.results;
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur Notion API:', error.message);
      }
      throw error;
    }
  }

  async getDatabaseSchema(databaseId) {
    try {
      const response = await this.client.databases.retrieve({
        database_id: databaseId
      });
      return {
        properties: response.properties
      };
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur lors de la récupération du schéma:', error.message);
      }
      throw error;
    }
  }

  async updateDatabaseSchema(databaseId, properties) {
    try {
      await this.client.databases.update({
        database_id: databaseId,
        properties
      });
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur lors de la mise à jour du schéma:', error.message);
      }
      throw error;
    }
  }

  // Méthodes spécifiques pour les activités
  async createActivity(properties) {
    return this.createPage(this.databaseIds.activities, properties);
  }

  async updateActivity(pageId, properties) {
    return this.updatePage(pageId, properties);
  }

  async getActivity(pageId) {
    return this.getPage(pageId);
  }

  async listActivities(filter) {
    return this.queryDatabase(this.databaseIds.activities, filter);
  }

  // Méthodes spécifiques pour les clients
  async createClient(properties) {
    return this.createPage(this.databaseIds.clients, properties);
  }

  async updateClient(pageId, properties) {
    return this.updatePage(pageId, properties);
  }

  async getClient(pageId) {
    return this.getPage(pageId);
  }

  async listClients(filter) {
    return this.queryDatabase(this.databaseIds.clients, filter);
  }

  // Méthodes spécifiques pour les partenaires
  async createPartner(properties) {
    return this.createPage(this.databaseIds.partners, properties);
  }

  async updatePartner(pageId, properties) {
    return this.updatePage(pageId, properties);
  }

  async getPartner(pageId) {
    return this.getPage(pageId);
  }

  async listPartners(filter) {
    return this.queryDatabase(this.databaseIds.partners, filter);
  }

  // Méthodes spécifiques pour les ressources
  async createResource(properties) {
    return this.createPage(this.databaseIds.resources, properties);
  }

  async updateResource(pageId, properties) {
    return this.updatePage(pageId, properties);
  }

  async getResource(pageId) {
    return this.getPage(pageId);
  }

  async listResources(filter) {
    return this.queryDatabase(this.databaseIds.resources, filter);
  }

  // Méthodes spécifiques pour les indicateurs
  async createIndicator(properties) {
    return this.createPage(this.databaseIds.indicators, properties);
  }

  async updateIndicator(pageId, properties) {
    return this.updatePage(pageId, properties);
  }

  async getIndicator(pageId) {
    return this.getPage(pageId);
  }

  async listIndicators(filter) {
    return this.queryDatabase(this.databaseIds.indicators, filter);
  }

  // Méthode de test de connexion
  async testConnection() {
    try {
      await this.client.users.me();
      return true;
    } catch (error) {
      if (error instanceof APIResponseError) {
        console.error('Erreur de connexion Notion:', error.message);
      }
      return false;
    }
  }
}

// Créer une instance avec la configuration depuis .env.local
const notionService = new NotionService({
  apiKey: process.env.NOTION_API_KEY || '',
  databaseIds: {
    activities: process.env.NOTION_ACTIVITES_ET_SERVICES_DB_ID || '',
    clients: process.env.NOTION_CLIENTS_DB_ID || '',
    partners: process.env.NOTION_PARTENARIATS_ET_FOURNISSEURS_DB_ID || '',
    resources: process.env.NOTION_RESSOURCES_ET_STOCKS_DB_ID || '',
    indicators: process.env.NOTION_INDICATEURS_ECOLOGIQUES_DB_ID || ''
  }
});

module.exports = { notionService, NotionService };
