import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Commande pour lancer VSCode sur Windows
    await execAsync('code .');
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'VSCode a été lancé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du lancement de VSCode:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors du lancement de VSCode'
    }, { status: 500 });
  }
}
