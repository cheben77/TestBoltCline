import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Commande pour lancer Chrome sur Windows
    await execAsync('start chrome');
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Google Chrome a été lancé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du lancement de Chrome:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors du lancement de Chrome'
    }, { status: 500 });
  }
}
