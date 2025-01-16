import { NextRequest, NextResponse } from 'next/server';
import { ollamaService } from '@/features/chatbot';
import { notionService } from '@/services/notion';

export async function POST(request: NextRequest) {
  console.log('Début de la requête chat');
  try {
    const body = await request.json();
    console.log('Corps de la requête:', body);

    if (!body.message) {
      console.error('Message manquant dans la requête');
      return NextResponse.json(
        { error: 'Le message est requis' },
        { status: 400 }
      );
    }

    const { message, context } = body;
    console.log('Message reçu:', message);

    // Vérifier la connexion à Notion
    try {
      console.log('Tentative de connexion à Notion...');
      const products = await notionService.getProducts();
      console.log('Connexion à Notion établie, produits récupérés:', products.length);
    } catch (error) {
      console.error('Erreur détaillée de connexion à Notion:', error);
      console.error('Stack trace Notion:', error instanceof Error ? error.stack : 'No stack trace');
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données des produits' },
        { status: 500 }
      );
    }

    // Utiliser le service Ollama avec contexte Notion
    try {
      console.log('Tentative de génération de réponse avec Ollama...');

      let response;
      console.log('Mode:', body.mode);
      switch (body.mode) {
        case 'notion':
          const notionContext = await notionService.getContextForQuery(message);
          response = await ollamaService.chatWithNotion(message, body.model, notionContext);
          break;
        case 'file':
          if (!body.context?.content) {
            return NextResponse.json(
              { error: 'Contenu du fichier manquant' },
              { status: 400 }
            );
          }
          response = await ollamaService.chatWithFile(message, body.model, {
            filename: body.context.filename,
            content: body.context.content
          });
          break;
        default:
          response = await ollamaService.chat(message, body.model);
      }
      console.log('Réponse générée avec succès:', response.substring(0, 100) + '...');

      return NextResponse.json({ response });
    } catch (error) {
      console.error('Erreur détaillée de génération Ollama:', error);
      console.error('Stack trace Ollama:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'Erreur lors du traitement de votre demande';
      
      if (error instanceof Error) {
        if (error.message.includes('NOTION_API_KEY')) {
          errorMessage = 'Erreur de configuration de la base de données';
        } else if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Le service de chat est temporairement indisponible';
        } else if (error.message.includes('database_id')) {
          errorMessage = 'Base de données non trouvée';
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur générale du chatbot:', error);
    console.error('Stack trace général:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
