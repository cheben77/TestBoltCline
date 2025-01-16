import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Sur Windows, on utilise nvidia-smi pour vérifier la présence de CUDA
    const { stdout } = await execAsync('nvidia-smi');
    return NextResponse.json(stdout.includes('NVIDIA-SMI'));
  } catch (error) {
    return NextResponse.json(false);
  }
}
