import { NextResponse } from 'next/server';
import { TRIGGERS, Workflow } from '@/lib/triggers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Exécution d'un workflow
    if (body.workflow) {
      const workflow = body.workflow as Workflow;
      const results: string[] = [];
      let currentStepId = workflow.firstStepId;

      while (currentStepId) {
        const step = workflow.steps[currentStepId];
        const trigger = TRIGGERS.find(t => t.id === step.triggerId);

        if (!trigger) {
          throw new Error(`Trigger non trouvé: ${step.triggerId}`);
        }

        const result = await trigger.execute(step.params);
        results.push(result);

        currentStepId = step.next || '';
      }

      return NextResponse.json({ results });
    }

    // Exécution d'un trigger unique
    if (body.triggerId) {
      const trigger = TRIGGERS.find(t => t.id === body.triggerId);
      if (!trigger) {
        throw new Error(`Trigger non trouvé: ${body.triggerId}`);
      }

      const result = await trigger.execute(body.params || {});
      return NextResponse.json({ result });
    }

    throw new Error('Requête invalide');
  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
