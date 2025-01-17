import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'connected'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      error: 'Erreur de connexion à VSCode'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const tempDir = tmpdir();
    const timestamp = Date.now();
    const filePath = join(tempDir, `vscode-temp-${timestamp}.json`);

    await writeFile(filePath, content);

    return NextResponse.json({ 
      status: 'success',
      message: 'Workflow synchronisé avec VSCode'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Erreur lors de la synchronisation avec VSCode'
    }, { status: 500 });
  }
}
