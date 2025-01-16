import { NextResponse } from 'next/server';
import { loadTemplates, saveTemplate, deleteTemplate, Template } from '@/lib/templates';

export async function GET() {
  try {
    const templates = await loadTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erreur lors du chargement des templates:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const template: Template = await request.json();
    
    // Validation basique
    if (!template.id || !template.name || !template.template || !template.language) {
      return NextResponse.json(
        { error: 'Données de template invalides' },
        { status: 400 }
      );
    }
    
    await saveTemplate(template);
    return NextResponse.json({ message: 'Template sauvegardé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du template:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de template manquant' },
        { status: 400 }
      );
    }
    
    await deleteTemplate(id);
    return NextResponse.json({ message: 'Template supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du template:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du template' },
      { status: 500 }
    );
  }
}
