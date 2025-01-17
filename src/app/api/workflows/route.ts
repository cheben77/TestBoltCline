import { NextResponse } from 'next/server';
import { Workflow } from '../../../lib/triggers';

// Validation des paramètres d'un trigger
interface WorkflowStep {
  name: string;
  trigger?: {
    params?: {
      id: string;
      name: string;
      type: string;
      required?: boolean;
      options?: string[];
    }[];
  };
  params: Record<string, any>;
  nextStepId?: string;
}

function validateTriggerParams(step: WorkflowStep, errors: string[]) {
  if (!step.trigger?.params) return;
  
  for (const param of step.trigger.params) {
    if (param.required && !(param.id in step.params)) {
      errors.push(`Le paramètre ${param.name} est requis pour l'étape ${step.name}`);
      continue;
    }

    const value = step.params[param.id];
    if (value !== undefined) {
      switch (param.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors.push(`Le paramètre ${param.name} doit être un nombre`);
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`Le paramètre ${param.name} doit être un booléen`);
          }
          break;
        case 'select':
          if (!param.options?.includes(value)) {
            errors.push(`La valeur ${value} n'est pas valide pour ${param.name}`);
          }
          break;
      }
    }
  }
}

// Validation complète du workflow
function validateWorkflow(workflow: Workflow): string[] {
  const errors: string[] = [];

  // Validation des champs requis
  if (!workflow.name?.trim()) {
    errors.push('Le nom du workflow est requis');
  }

  if (!workflow.steps || Object.keys(workflow.steps).length === 0) {
    errors.push('Le workflow doit contenir au moins une étape');
    return errors;
  }

  // Validation de la première étape
  if (!workflow.firstStepId) {
    errors.push('L\'ID de la première étape est requis');
  } else if (!workflow.steps[workflow.firstStepId]) {
    errors.push('L\'ID de la première étape est invalide');
  }

  // Validation des étapes
  const visitedSteps = new Set<string>();
  let currentStepId: string | undefined = workflow.firstStepId;

  while (currentStepId && !visitedSteps.has(currentStepId)) {
    const step: WorkflowStep = workflow.steps[currentStepId] as WorkflowStep;
    if (!step) {
      errors.push(`L'étape ${currentStepId} n'existe pas`);
      break;
    }

    visitedSteps.add(currentStepId);

    // Validation du trigger
    if (!step.trigger) {
      errors.push(`L'étape ${step.name} doit avoir un trigger`);
    } else {
      validateTriggerParams(step, errors);
    }

    currentStepId = step.nextStepId;
  }

  // Vérification des étapes orphelines
  for (const [stepId, step] of Object.entries(workflow.steps) as [string, WorkflowStep][]) {
    if (!visitedSteps.has(stepId)) {
      errors.push(`L'étape ${step.name} n'est pas accessible depuis la première étape`);
    }
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const workflow: Workflow = await request.json();

    // Validation du workflow
    const errors = validateWorkflow(workflow);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // TODO: Ajouter la logique de sauvegarde dans la base de données
    // Pour l'exemple, on simule une sauvegarde réussie
    const savedWorkflow = {
      ...workflow,
      id: workflow.id || Math.random().toString(36).substring(7),
      status: 'active',
      createdAt: workflow.createdAt || new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(savedWorkflow);
  } catch (error) {
    console.error('Error saving workflow:', error);
    return NextResponse.json(
      { 
        message: 'Une erreur est survenue lors de la sauvegarde',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // TODO: Récupérer un workflow spécifique depuis la base de données
      return NextResponse.json({
        message: 'Not implemented: Get specific workflow'
      }, { status: 501 });
    }

    // TODO: Récupérer tous les workflows depuis la base de données
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { 
        message: 'Une erreur est survenue lors de la récupération des workflows',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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
        { message: 'L\'ID du workflow est requis' },
        { status: 400 }
      );
    }

    // TODO: Supprimer le workflow de la base de données
    return NextResponse.json(
      { message: 'Workflow supprimé avec succès' }
    );
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { 
        message: 'Une erreur est survenue lors de la suppression du workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
