import { ChatMessage } from '@/types/ollama';

const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434';

interface OllamaResponse {
  message: ChatMessage;
  done: boolean;
}

class OllamaService {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 30000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async chat({ model, messages }: { model: string; messages: ChatMessage[] }): Promise<OllamaResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `${OLLAMA_API_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur Ollama: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: {
          role: 'assistant',
          content: data.message.content,
        },
        done: true,
      };
    } catch (error) {
      console.error('Erreur lors de la communication avec Ollama:', error);
      throw new Error('Erreur lors de la communication avec le modèle de langage');
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${OLLAMA_API_URL}/api/tags`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des modèles: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models.map((model: any) => model.name);
    } catch (error) {
<<<<<<< HEAD
      console.error('Erreur lors de la récupération des modèles:', error);
      throw new Error('Impossible de récupérer la liste des modèles');
=======
      console.error('Erreur lors de la génération:', error);
      throw error;
    }
  }

  async chat(message: string, model?: string): Promise<string> {
    if (model) {
      this.setModel(model);
    }
    try {
      const prompt = `Tu es un assistant virtuel francophone pour StoaViva, une entreprise spécialisée dans les produits et services écologiques et bien-être. Tu dois TOUJOURS répondre en français.

Question du client : ${message}

Réponds de manière naturelle et utile en français.`;

      return this.generate(prompt);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      throw error;
    }
  }

  async chatWithFile(message: string, model?: string, context?: { filename?: string; content?: string; type?: string }): Promise<string> {
    if (model) {
      this.setModel(model);
    }
    try {
      let prompt;
      if (context?.type?.startsWith('image/')) {
        // Pour les images, utiliser le format multimodal
        prompt = JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  data: context.content
                },
                {
                  type: 'text',
                  text: `Tu es un assistant virtuel francophone pour StoaViva. Tu dois TOUJOURS répondre en français.\n\nAnalyse cette image et réponds à la question en français : ${message}`
                }
              ]
            }
          ],
          stream: false
        });

        // Appel direct à l'API Ollama pour les images
        const response = await fetch(`${this.endpoint}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: prompt
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message?.content || 'Désolé, je n\'ai pas pu analyser l\'image.';
      } else {
        // Pour les fichiers texte, utiliser le format standard
        prompt = `Tu es un assistant virtuel francophone pour StoaViva. Tu dois TOUJOURS répondre en français.

Voici le contenu du fichier ${context?.filename} :
${context?.content}

Analyse ce contenu et réponds à la question en français : ${message}`;

        return this.generate(prompt);
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      throw error;
    }
  }

  async chatWithNotion(message: string, model?: string, notionContext?: any): Promise<string> {
    if (model) {
      this.setModel(model);
    }
    try {
      const prompt = `Tu es un assistant virtuel francophone pour StoaViva. Tu dois TOUJOURS répondre en français.

Voici les produits pertinents pour la requête :
${JSON.stringify(notionContext?.products || [], null, 2)}

Voici les services pertinents pour la requête avec leurs disponibilités :
${JSON.stringify(notionContext?.services || [], null, 2)}

Question du client : ${message}

Réponds de manière naturelle et utile en français, en te basant sur les produits et services disponibles. Si tu suggères des produits ou services, utilise uniquement ceux listés ci-dessus. Si aucun produit ou service ne correspond exactement à la demande, suggère les alternatives les plus proches en expliquant pourquoi tu les recommandes.

Pour les questions sur les disponibilités :
- Utilise le champ 'availability' des services qui contient les jours et heures disponibles
- Indique clairement les créneaux disponibles pour chaque service
- Si un service n'a pas de disponibilités, suggère d'autres créneaux ou services similaires

Format de réponse souhaité (en français) :
1. Réponse directe à la question
2. Disponibilités si demandées
3. Suggestions de produits/services pertinents
4. Conseils ou recommandations supplémentaires`;

      return this.generate(prompt);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      throw error;
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
    }
  }
}

export const ollamaService = new OllamaService();
