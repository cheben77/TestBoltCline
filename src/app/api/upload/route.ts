import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadDir, filename);

    // Convertir le fichier en buffer et l'écrire sur le disque
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Retourner le chemin relatif pour l'accès via l'API
    const publicPath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filename,
      path: publicPath,
      type: file.type
    });

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
