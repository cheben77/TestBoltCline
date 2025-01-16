import { notionService } from './notion';

export interface OllamaConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

class OllamaService {
  private static instance: OllamaService;
  private endpoint: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  private constructor() {
    this.endpoint = process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434/api';
    this.model = process.env.DEFAULT_OLLAMA_MODEL || 'llama3.1:8b';
    this.temperature = 0.7;
    this.maxTokens = 2048;
  }

  setModel(model: string) {
    console.log(`Changement de modèle : ${this.model} -> ${model}`);
    this.model = model;
  }

  getCurrentModel(): string {
    return this.model;
  }

  public static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService();
    }
    return OllamaService.instance;
  }

  async generate(prompt: string): Promise<string> {
    try {
      const modelBeforeRequest = this.getCurrentModel();
      console.log('Configuration Ollama:', {
        endpoint: this.endpoint,
        modelActuel: modelBeforeRequest,
        temperature: this.temperature,
        maxTokens: this.maxTokens
      });
      console.log('Envoi de la requête à Ollama avec le modèle:', modelBeforeRequest);

      const response = await fetch(`${this.endpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      let fullResponse = '';
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
          }
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
        }
      }
      
      console.log('Réponse complète générée:', fullResponse.substring(0, 100) + '...');
      return fullResponse;
    } catch (error) {
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
    }
  }
}

export async function listModels(): Promise<string[]> {
  try {
    const endpoint = process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434/api';
    const response = await fetch(`${endpoint}/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.models.map((model: any) => model.name);
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error);
    throw error;
  }
}

export const ollamaService = OllamaService.getInstance();
