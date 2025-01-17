import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

let lastContent: string | null = null;
let lastCheck: number = Date.now();

export async function GET() {
  try {
    const tempDir = tmpdir();
    const files = await readdir(tempDir);
    const vscodeFiles = files.filter(file => 
      file.startsWith('vscode-temp-') && 
      file.endsWith('.json')
    );

    if (vscodeFiles.length === 0) {
      return NextResponse.json({ status: 'no_changes' });
    }

    // Trouver le fichier le plus récent
    const latestFile = vscodeFiles.reduce((latest, current) => {
      const currentTime = parseInt(current.split('-')[2].split('.')[0]);
      const latestTime = parseInt(latest.split('-')[2].split('.')[0]);
      return currentTime > latestTime ? current : latest;
    });

    // Vérifier si le fichier a été modifié depuis la dernière vérification
    const filePath = join(tempDir, latestFile);
    const fileStats = await stat(filePath);
    const modifiedTime = fileStats.mtime.getTime();

    if (modifiedTime <= lastCheck) {
      return NextResponse.json({ status: 'no_changes' });
    }

    // Lire le contenu du fichier
    const content = await readFile(filePath, 'utf-8');

    // Vérifier si le contenu a changé
    if (content === lastContent) {
      return NextResponse.json({ status: 'no_changes' });
    }

    lastContent = content;
    lastCheck = Date.now();

    try {
      const workflow = JSON.parse(content);
      return NextResponse.json({ 
        status: 'updated',
        workflow
      });
    } catch (error) {
      console.error('Erreur lors du parsing du workflow:', error);
      return NextResponse.json({ 
        status: 'error',
        message: 'Format de workflow invalide'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur lors de la surveillance des fichiers:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors de la surveillance des fichiers'
    }, { status: 500 });
  }
}
