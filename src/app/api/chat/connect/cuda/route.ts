import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkCuda() {
  try {
    // Sur Windows, on utilise nvidia-smi pour vérifier la présence de CUDA
    const { stdout } = await execAsync('nvidia-smi');
    return stdout.includes('NVIDIA-SMI');
  } catch (error) {
    console.error('Erreur lors de la vérification CUDA:', error);
    return false;
  }
}

export async function GET() {
  try {
    const isAvailable = await checkCuda();
    return NextResponse.json({ 
      status: isAvailable ? 'connected' : 'disconnected',
      details: isAvailable ? 'CUDA disponible' : 'CUDA non disponible'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification CUDA:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification CUDA'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const isAvailable = await checkCuda();
    return NextResponse.json({ 
      status: isAvailable ? 'connected' : 'disconnected',
      details: isAvailable ? 'CUDA disponible' : 'CUDA non disponible'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification CUDA:', error);
    return NextResponse.json({ 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Erreur de vérification CUDA'
    }, { status: 500 });
  }
}
