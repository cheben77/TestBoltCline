import { NextRequest, NextResponse } from 'next/server';
import { notionService } from '@/services/notion';
import { ollamaService } from '@/services/ollama';
import type { ChatMessage } from '@/types/ollama';
import type { Product } from '@/types/notion';

interface ChatContext {
  type: 'notion' | 'file';
  data?: any;
}

interface ChatRequestBody {
  message: string;
  context?: ChatContext;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, context } = body;

    // Enrichir le contexte avec les données de Notion si nécessaire
    let notionContext = null;
    if (context?.type === 'notion') {
      const products = await notionService.getProducts({
        filter: {
          or: [
            { property: 'Name', rich_text: { contains: message } },
            { property: 'Description', rich_text: { contains: message } }
          ]
        }
      });

      if (products.results.length > 0) {
        notionContext = {
          type: 'products',
          data: products.results
        };
      }
    }

    // Construire les messages pour le chat
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Tu es un assistant spécialisé dans les produits et services écologiques de StoaViva. 
        ${notionContext ? `
        Voici les produits pertinents trouvés :
        ${notionContext.data.map((product: Product) => `
          - ${product.name}
          - Description: ${product.description}
          - Prix: ${product.price}€
          - Impact écologique: ${product.eco_impact.score}/10
          - Bénéfices: ${product.benefits.join(', ')}
        `).join('\n')}
        ` : 'Aucun produit spécifique trouvé pour cette requête.'}
        
        Réponds de manière concise et précise, en mettant l'accent sur les aspects écologiques et les bénéfices pour l'utilisateur.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    // Générer la réponse avec Ollama
    const response = await ollamaService.chat({
      model: process.env.OLLAMA_MODEL || 'codestral:latest',
      messages
    });

    return NextResponse.json({ response: response.message.content });
  } catch (error) {
    console.error('Erreur dans le chatbot :', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre message.' },
      { status: 500 }
    );
  }
}
