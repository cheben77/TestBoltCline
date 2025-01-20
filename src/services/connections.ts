import { ollamaService } from './ollama';

export interface ConnectionStatus {
  status: 'connected' | 'disconnected';
  error?: string;
}

class ConnectionsService {
  private async callModel(service: string, action: 'connect' | 'status') {
    try {
      const prompt = `${action === 'connect' ? 'Connecter' : 'Vérifier le statut de'} le service ${service}`;
      const response = await ollamaService.chat(prompt, 'codestral:latest');
      
      // Analyser la réponse du modèle pour déterminer le statut
      const isConnected = response.toLowerCase().includes('succès') || 
                         response.toLowerCase().includes('connecté') ||
                         response.toLowerCase().includes('connected');
      
      return { 
        status: isConnected ? 'connected' as const : 'disconnected' as const 
      };
    } catch (error) {
      console.error(`Erreur lors de l'appel au modèle pour ${service}:`, error);
      return { 
        status: 'disconnected' as const, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  async connect(service: string): Promise<ConnectionStatus> {
    try {
      // Convertir le nom du service en format URL
      const serviceUrl = service.toLowerCase().replace(/\s+/g, '-');
      
      // Appeler l'API de connexion
      const response = await fetch(`/api/chat/connect/${serviceUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Utiliser le modèle pour analyser la connexion
      const modelResponse = await this.callModel(service, 'connect');
      
      return modelResponse;
    } catch (error) {
      console.error(`Erreur lors de la connexion à ${service}:`, error);
      return { 
        status: 'disconnected' as const, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  async checkStatus(service: string): Promise<ConnectionStatus> {
    try {
      // Convertir le nom du service en format URL
      const serviceUrl = service.toLowerCase().replace(/\s+/g, '-');
      
      // Vérifier le statut via l'API
      const response = await fetch(`/api/chat/connect/${serviceUrl}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Utiliser le modèle pour analyser le statut
      const modelResponse = await this.callModel(service, 'status');
      
      return modelResponse;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut ${service}:`, error);
      return { status: 'disconnected', error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  async checkAllStatuses(services: string[]): Promise<Record<string, ConnectionStatus>> {
    const statuses: Record<string, ConnectionStatus> = {};
    
    // Vérifier les statuts séquentiellement pour éviter de surcharger Ollama
    for (const service of services) {
      try {
        statuses[service] = await this.checkStatus(service);
      } catch (error) {
        console.error(`Erreur lors de la vérification du statut de ${service}:`, error);
        statuses[service] = {
          status: 'disconnected' as const,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
      // Ajouter un petit délai entre chaque vérification
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return statuses;
  }
}

export const connectionsService = new ConnectionsService();
