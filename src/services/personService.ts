import { notionService } from './notion';
import { ollamaService } from './ollama';

export interface Person {
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

class PersonService {
  private static instance: PersonService;

  private constructor() {}

  public static getInstance(): PersonService {
    if (!PersonService.instance) {
      PersonService.instance = new PersonService();
    }
    return PersonService.instance;
  }

  async getPersons(): Promise<Person[]> {
    try {
      return await notionService.getPersons();
    } catch (error) {
      console.error('Erreur lors de la récupération des personnes:', error);
      throw error;
    }
  }

  async searchPersons(query: string): Promise<Person[]> {
    try {
      return await notionService.searchPersons(query);
    } catch (error) {
      console.error('Erreur lors de la recherche des personnes:', error);
      throw error;
    }
  }

  async analyzePersonInterests(person: Person): Promise<string> {
    try {
      const prompt = `Analyse les intérêts suivants de ${person.name} :
${person.interests.join(', ')}

En te basant sur ces intérêts, suggère :
1. Des produits écologiques qui pourraient l'intéresser
2. Des services bien-être adaptés
3. Des ateliers recommandés

Format de réponse souhaité :
- Suggestions personnalisées
- Justification basée sur les intérêts
- Niveau de priorité (Élevé/Moyen/Faible) pour chaque suggestion`;

      const analysis = await ollamaService.generate(prompt);
      return analysis;
    } catch (error) {
      console.error('Erreur lors de l\'analyse des intérêts:', error);
      throw error;
    }
  }

  async generatePersonalizedMessage(person: Person, context: string): Promise<string> {
    try {
      const prompt = `Tu es l'assistant virtuel de StoaViva, spécialisé dans les produits et services écologiques et bien-être.

Informations sur la personne :
- Nom : ${person.name}
- Intérêts : ${person.interests.join(', ')}
- Statut : ${person.status}
- Dernier contact : ${person.last_contact}
- Notes : ${person.notes}

Contexte de la communication : ${context}

Génère un message personnalisé qui :
1. Est adapté à son profil et ses intérêts
2. Fait référence à ses interactions précédentes
3. Propose des suggestions pertinentes
4. Maintient un ton professionnel mais chaleureux

Le message doit être concis mais impactant.`;

      const message = await ollamaService.generate(prompt);
      return message;
    } catch (error) {
      console.error('Erreur lors de la génération du message:', error);
      throw error;
    }
  }

  async suggestNextActions(person: Person): Promise<string> {
    try {
      const prompt = `En tant qu'assistant StoaViva, analyse le profil suivant :

Personne : ${person.name}
Intérêts : ${person.interests.join(', ')}
Statut : ${person.status}
Dernier contact : ${person.last_contact}
Notes : ${person.notes}

Suggère les prochaines actions à entreprendre pour :
1. Améliorer l'engagement
2. Proposer des produits/services adaptés
3. Planifier les prochaines interactions

Format de réponse :
- Actions prioritaires (court terme)
- Actions recommandées (moyen terme)
- Opportunités futures (long terme)
- Points d'attention particuliers`;

      const suggestions = await ollamaService.generate(prompt);
      return suggestions;
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      throw error;
    }
  }
}

export const personService = PersonService.getInstance();
