import { notionService } from '@/services/notion';
import { ollamaService } from '@/services/ollama';

export interface ClientPreferences {
  budget?: number;
  interests: string[];
  ecologicalPriority: number;
  wellnessGoals: string[];
  restrictions?: string[];
  type?: string;
  experience_level?: string;
}

export interface AnalysisResult {
  summary: string;
  ecologicalImpact: {
    current: string;
    improvements: string[];
  };
  recommendations: string[];
  products?: Array<{
    id: string;
    name: string;
    analysis: string;
  }>;
  analysis?: string;
}

export interface KitSuggestion {
  products: Array<{
    id: string;
    name: string;
    price: number;
    reason: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    price: number;
    reason: string;
  }>;
  totalPrice: number;
  benefits: string[];
  suggestion?: string;
}

/**
 * Analyse les préférences client et suggère un kit personnalisé
 */
export async function suggestCustomKitForClient(preferences: ClientPreferences): Promise<KitSuggestion> {
  try {
    // Récupérer les données depuis Notion
    const products = await notionService.getProducts();
    const services = await notionService.getServices();
    const reviews = await notionService.getCustomerReviews();

    // Enrichir les produits avec leurs avis
    const productsWithReviews = products.map(product => ({
      ...product,
      reviews: reviews.filter(review => review.product_id === product.id)
    }));

    // Enrichir les services avec leurs avis
    const servicesWithReviews = services.map(service => ({
      ...service,
      reviews: reviews.filter(review => review.service_id === service.id)
    }));

    // Créer le prompt pour Ollama avec le contexte Notion
    const prompt = `En tant qu'assistant StoaViva, analyse ces préférences client :
${JSON.stringify(preferences, null, 2)}

Voici nos produits disponibles avec leurs avis clients :
${JSON.stringify(productsWithReviews, null, 2)}

Et nos services disponibles avec leurs avis clients :
${JSON.stringify(servicesWithReviews, null, 2)}

Suggère un kit personnalisé qui :
1. Correspond aux préférences du client
2. A de bons retours clients
3. Offre une expérience cohérente
4. Respecte nos valeurs écologiques

Format de réponse souhaité (en JSON) :
{
  "products": [
    {
      "id": "id_du_produit",
      "name": "nom_du_produit",
      "price": prix_en_euros,
      "reason": "raison_de_la_recommandation"
    }
  ],
  "services": [
    {
      "id": "id_du_service",
      "name": "nom_du_service",
      "price": prix_en_euros,
      "reason": "raison_de_la_recommandation"
    }
  ],
  "totalPrice": prix_total_en_euros,
  "benefits": ["bénéfice_1", "bénéfice_2", ...],
  "suggestion": "texte_explicatif_de_la_suggestion"
}`;

    // Utiliser Ollama pour générer la suggestion
    const response = await ollamaService.generate(prompt);
    return JSON.parse(response) as KitSuggestion;

  } catch (error) {
    console.error('Erreur lors de la suggestion de kit:', error);
    throw error;
  }
}

/**
 * Analyse l'impact écologique des activités
 */
export async function analyzeEcologicalImpact(): Promise<AnalysisResult> {
  try {
    // Récupérer les données depuis Notion
    const [products, ecoImpact] = await Promise.all([
      notionService.getProducts(),
      notionService.getEcologicalImpact()
    ]);

    // Créer le prompt pour Ollama avec le contexte Notion
    const prompt = `En tant qu'expert en impact environnemental, analyse ces données :

Produits :
${JSON.stringify(products, null, 2)}

Métriques d'impact écologique :
${JSON.stringify(ecoImpact, null, 2)}

Format de réponse souhaité (en JSON) :
{
  "summary": "résumé_de_l_analyse",
  "ecologicalImpact": {
    "current": "description_impact_actuel",
    "improvements": ["amélioration_1", "amélioration_2", ...]
  },
  "recommendations": ["recommandation_1", "recommandation_2", ...],
  "products": [
    {
      "id": "id_du_produit",
      "name": "nom_du_produit",
      "analysis": "analyse_spécifique_du_produit"
    }
  ],
  "analysis": "analyse_globale_détaillée"
}`;

    // Utiliser Ollama pour générer l'analyse
    const response = await ollamaService.generate(prompt);
    return JSON.parse(response) as AnalysisResult;

  } catch (error) {
    console.error('Erreur lors de l\'analyse écologique:', error);
    throw error;
  }
}

/**
 * Répond aux questions des clients
 */
export async function handleCustomerQuery(query: string): Promise<string> {
  try {
    // Récupérer le contexte pertinent depuis Notion
    const context = await notionService.getContextForQuery(query);

    // Créer le prompt pour Ollama avec le contexte Notion
    const prompt = `En tant qu'assistant StoaViva, réponds à cette question :
"${query}"

Voici le contexte pertinent de notre base de données :
${JSON.stringify(context, null, 2)}

Directives :
1. Utilise uniquement les informations fournies
2. Sois précis et factuel
3. Suggère des produits/services pertinents
4. Mentionne les avis clients si disponibles
5. Reste aligné avec nos valeurs écologiques`;

    // Utiliser Ollama pour générer la réponse
    const response = await ollamaService.generate(prompt);
    return response;

  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    throw error;
  }
}

/**
 * Génère des descriptions de tâches pour Notion
 */
export async function generateTaskDescription(task: string): Promise<string> {
  try {
    // Récupérer le contexte depuis Notion
    const [products, services] = await Promise.all([
      notionService.getProducts(),
      notionService.getServices()
    ]);

    // Créer le prompt pour Ollama avec le contexte Notion
    const prompt = `En tant que gestionnaire de projet StoaViva, formate cette tâche :
"${task}"

Contexte de l'entreprise :
Produits : ${JSON.stringify(products, null, 2)}
Services : ${JSON.stringify(services, null, 2)}

Format de réponse souhaité :
1. Titre clair et concis
2. Description détaillée
3. Points clés à accomplir
4. Critères de réussite
5. Impact écologique à considérer`;

    // Utiliser Ollama pour générer la description
    const description = await ollamaService.generate(prompt);
    return description;

  } catch (error) {
    console.error('Erreur lors de la génération de la description:', error);
    throw error;
  }
}

// Fonctions de compatibilité pour l'ancien code
export const analyzeProductsAndCreateReport = analyzeEcologicalImpact;
export const generateEcoReport = analyzeEcologicalImpact;
