import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { TRIGGERS, Workflow, executeWorkflow } from '@/lib/triggers';

// Exécute un script Python
async function executePythonScript(script: string, params: Record<string, any>): Promise<string> {
  const tempDir = tmpdir();
  const scriptPath = join(tempDir, `script-${Date.now()}.py`);
  
  // Remplacer les paramètres dans le script
  const scriptWithParams = script.replace(
    /input_data/g, 
    JSON.stringify(params.input_data)
  ).replace(
    /processing_type/g,
    `"${params.processing_type}"`
  );
  
  // Écrire le script temporaire
  await writeFile(scriptPath, scriptWithParams);
  
  return new Promise((resolve, reject) => {
    const process = spawn('python', [scriptPath]);
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      console.error(`Erreur Python: ${data}`);
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Erreur d'exécution Python (${code})`));
      }
    });
  });
}

export async function POST(request: Request) {
  try {
    const { triggerId, params, workflow } = await request.json();
    
    // Si un workflow complet est fourni
    if (workflow) {
      const results = await executeWorkflow(workflow);
      return NextResponse.json({ results });
    }
    
    // Si un seul trigger est fourni
    const trigger = TRIGGERS.find(t => t.id === triggerId);
    if (!trigger) {
      return NextResponse.json(
        { error: 'Trigger non trouvé' },
        { status: 404 }
      );
    }
    
    let result;
    if (trigger.language === 'python') {
      result = await executePythonScript(trigger.template, params);
    } else {
      result = await trigger.execute(params);
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Erreur lors de l\'exécution du trigger:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'exécution du trigger' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Retourner la liste des triggers disponibles
    const triggers = TRIGGERS.map(({ id, name, description, language, params }) => ({
      id,
      name,
      description,
      language,
      params,
    }));
    
    return NextResponse.json(triggers);
  } catch (error) {
    console.error('Erreur lors de la récupération des triggers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des triggers' },
      { status: 500 }
    );
  }
}
