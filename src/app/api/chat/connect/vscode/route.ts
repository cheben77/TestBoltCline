import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    // Créer un fichier temporaire avec le contenu
    const tempDir = tmpdir();
    const tempFile = join(tempDir, `vscode-temp-${Date.now()}.txt`);
    
    await writeFile(tempFile, content);
    
    // Ouvrir le fichier dans VSCode
    await execAsync(`code "${tempFile}"`);
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Fichier ouvert dans VSCode',
      path: tempFile
    });
  } catch (error) {
    console.error('Erreur lors de l\'ouverture dans VSCode:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors de l\'ouverture dans VSCode'
    }, { status: 500 });
  }
}
