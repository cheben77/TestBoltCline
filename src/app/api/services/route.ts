import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'start') {
      // Démarrer Ollama s'il n'est pas déjà en cours d'exécution
      try {
        await execAsync('ollama serve');
      } catch (error) {
        console.log('Ollama est peut-être déjà en cours d\'exécution');
      }

      // Installer les modèles nécessaires s'ils ne sont pas déjà installés
      try {
        await execAsync('ollama pull mistral');
      } catch (error) {
        console.error('Erreur lors de l\'installation de mistral:', error);
      }

      return NextResponse.json({ status: 'started', message: 'Services démarrés avec succès' });
    } else if (action === 'stop') {
      // Arrêter Ollama
      try {
        await execAsync('taskkill /F /IM ollama.exe');
      } catch (error) {
        console.error('Erreur lors de l\'arrêt d\'Ollama:', error);
      }

      return NextResponse.json({ status: 'stopped', message: 'Services arrêtés avec succès' });
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la gestion des services' },
      { status: 500 }
    );
  }
}
