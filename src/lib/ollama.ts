export interface OllamaConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export class Ollama {
  private endpoint: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: OllamaConfig) {
    this.endpoint = process.env.OLLAMA_ENDPOINT || '/api/ollama';
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
  }

  async generate(prompt: string): Promise<string> {
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

    const data = await response.json();
    return data.response;
  }

  async analyzeProducts(products: any[]): Promise<string> {
    const prompt = `Analyse les produits suivants et suggère des améliorations pour leur impact écologique :
${JSON.stringify(products, null, 2)}

Format de réponse souhaité :
1. Tendances actuelles
2. Points forts écologiques
3. Suggestions d'amélioration
4. Recommandations de nouveaux produits`;

    return this.generate(prompt);
  }

  async suggestCustomKit(preferences: any, products: any[]): Promise<string> {
    const prompt = `Crée un kit personnalisé basé sur ces préférences client :
${JSON.stringify(preferences, null, 2)}

Produits disponibles :
${JSON.stringify(products, null, 2)}

Format de réponse souhaité :
1. Produits recommandés
2. Justification des choix
3. Prix total estimé
4. Bénéfices attendus`;

    return this.generate(prompt);
  }

  async generateTaskDescription(task: string): Promise<string> {
    const prompt = `Formate cette tâche pour Notion :
${task}

Format de réponse souhaité :
- Titre clair et concis
- Description détaillée
- Points clés à accomplir
- Critères de réussite`;

    return this.generate(prompt);
  }

  async generateEcoReport(activities: any[]): Promise<string> {
    const prompt = `Génère un rapport d'impact écologique pour ces activités :
${JSON.stringify(activities, null, 2)}

Format de réponse souhaité :
1. Résumé exécutif
2. Impact environnemental détaillé
3. Comparaison avec les objectifs
4. Recommandations d'amélioration
5. Prochaines étapes suggérées`;

    return this.generate(prompt);
  }
}

// Instance par défaut avec le modèle llama3
export const defaultOllama = new Ollama({
  model: 'llama3.1:8b',
  temperature: 0.7,
});
