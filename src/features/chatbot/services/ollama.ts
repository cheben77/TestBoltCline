class OllamaService {
  private endpoint: string;
  private modelActuel: string;
  private temperature: number;
  private maxTokens: number;

  constructor() {
    this.endpoint = 'http://127.0.0.1:11434/api';
    this.modelActuel = 'llama3.1:8b';
    this.temperature = 0.7;
    this.maxTokens = 2048;
  }

  async chat(message: string, model?: string): Promise<string> {
    if (model && model !== this.modelActuel) {
      console.log('Changement de modèle :', this.modelActuel, '->', model);
      this.modelActuel = model;
    }

    console.log('Configuration Ollama:', {
      endpoint: this.endpoint,
      modelActuel: this.modelActuel,
      temperature: this.temperature,
      maxTokens: this.maxTokens
    });

    console.log('Envoi de la requête à Ollama avec le modèle:', this.modelActuel);

    try {
      const response = await fetch(`${this.endpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelActuel,
          prompt: message,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      let fullResponse = '';
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
            console.log('Réponse partielle:', fullResponse);
          }
          if (data.done) {
            break;
          }
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
        }
      }

      console.log('Réponse complète générée:', fullResponse);
      return fullResponse;
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      throw error;
    }
  }

  async chatWithNotion(message: string, model?: string, notionContext?: any): Promise<string> {
    const contextPrompt = notionContext ? 
      `Contexte de la base de données Notion:\n${JSON.stringify(notionContext, null, 2)}\n\nQuestion: ${message}` :
      message;

    return this.chat(contextPrompt, model);
  }

  async chatWithFile(message: string, model?: string, fileContext?: { filename: string; content: string }): Promise<string> {
    const contextPrompt = fileContext ? 
      `Contenu du fichier ${fileContext.filename}:\n${fileContext.content}\n\nQuestion: ${message}` :
      message;

    return this.chat(contextPrompt, model);
  }
}

const ollamaService = new OllamaService();
export default ollamaService;
