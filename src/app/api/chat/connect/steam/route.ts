import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Commande pour lancer Steam sur Windows
    await execAsync('start steam://');
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Steam a été lancé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du lancement de Steam:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors du lancement de Steam'
    }, { status: 500 });
  }
}
