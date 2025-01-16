import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

const getFileExtension = (language: string): string => {
  switch (language) {
    case 'javascript':
      return 'js';
    case 'typescript':
      return 'ts';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'markdown':
      return 'md';
    default:
      return 'txt';
  }
};

export async function POST(request: Request) {
  try {
    const { content, language = 'text' } = await request.json();
    
    // Créer un fichier temporaire avec le contenu
    const tempDir = tmpdir();
    const extension = getFileExtension(language);
    const tempFile = join(tempDir, `vscode-temp-${Date.now()}.${extension}`);
    
    await writeFile(tempFile, content);
    
    // Ouvrir le fichier dans VSCode
    await execAsync(`code "${tempFile}"`);
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Fichier ouvert dans VSCode',
      path: tempFile,
      language
    });
  } catch (error) {
    console.error('Erreur lors de l\'ouverture dans VSCode:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors de l\'ouverture dans VSCode'
    }, { status: 500 });
  }
}
