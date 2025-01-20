<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
=======
import { NextResponse } from 'next/server';
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

<<<<<<< HEAD
export async function GET(request: NextRequest) {
  try {
    // Sur Windows, utilise nvidia-smi pour vérifier CUDA
    const { stdout } = await execAsync('nvidia-smi');
    
    // Analyse la sortie pour obtenir les informations CUDA
    const cudaInfo = {
      available: true,
      version: '',
      gpuName: '',
      memoryTotal: '',
      memoryUsed: ''
    };

    // Extraire la version CUDA
    const cudaVersionMatch = stdout.match(/CUDA Version: ([\d.]+)/);
    if (cudaVersionMatch) {
      cudaInfo.version = cudaVersionMatch[1];
    }

    // Extraire le nom du GPU
    const gpuNameMatch = stdout.match(/(?:NVIDIA )?([\w\s]+) \|/);
    if (gpuNameMatch) {
      cudaInfo.gpuName = gpuNameMatch[1].trim();
    }

    // Extraire les informations de mémoire
    const memoryMatch = stdout.match(/(\d+)MiB\s*\/\s*(\d+)MiB/);
    if (memoryMatch) {
      cudaInfo.memoryUsed = `${memoryMatch[1]}MB`;
      cudaInfo.memoryTotal = `${memoryMatch[2]}MB`;
    }

    return NextResponse.json(cudaInfo);
  } catch (error) {
    // Si nvidia-smi n'est pas disponible, CUDA n'est probablement pas installé
    console.warn('CUDA non disponible:', error);
    return NextResponse.json({
      available: false,
      error: 'CUDA n\'est pas disponible sur ce système',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
=======
export async function GET() {
  try {
    // Sur Windows, on utilise nvidia-smi pour vérifier la présence de CUDA
    const { stdout } = await execAsync('nvidia-smi');
    return NextResponse.json(stdout.includes('NVIDIA-SMI'));
  } catch (error) {
    return NextResponse.json(false);
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  }
}
