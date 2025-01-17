import { NextRequest, NextResponse } from 'next/server';
import { validateParams } from '@/lib/modelConfig';

export async function POST(req: NextRequest) {
  try {
    const { message, model, mode, modelParams, context } = await req.json();

    // Valider les paramètres du modèle
    const validatedParams = validateParams(model, modelParams);

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: false,
        ...validatedParams,
        context: context ? {
          type: context.type,
          content: context.content,
          filename: context.filename
        } : undefined
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ollama API error:', error);
      return NextResponse.json({ error: 'Erreur lors de la génération de la réponse' }, { status: 500 });
    }

    const data = await response.json();
    
    // Déterminer le contexte de la réponse
    let responseContext = 'default';
    const response_text = data.response || '';
    
    if (response_text.includes('erreur') || response_text.includes('error')) {
      responseContext = 'error';
    } else if (response_text.includes('code') || response_text.includes('function')) {
      responseContext = 'code';
    } else if (response_text.includes('analyse') || response_text.includes('performance')) {
      responseContext = 'analysis';
    } else if (response_text.includes('résumé') || response_text.includes('synthèse')) {
      responseContext = 'summary';
    }

    return NextResponse.json({
      response: response_text,
      context: responseContext
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
