export interface TriggerParam {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  options?: string[]; // Pour le type 'select'
  defaultValue?: any;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  language: string;
  params: TriggerParam[];
  template: string;
  execute: (params: Record<string, any>) => Promise<string>;
}

export const TRIGGERS: Trigger[] = [
  {
    id: 'python-script',
    name: 'Script Python',
    description: 'Exécute un script Python',
    language: 'python',
    params: [
      {
        id: 'input_data',
        name: 'Données d\'entrée',
        type: 'string',
        description: 'Données à traiter',
      },
      {
        id: 'processing_type',
        name: 'Type de traitement',
        type: 'select',
        description: 'Méthode de traitement des données',
        options: ['analyse', 'transformation', 'filtrage'],
      },
    ],
    template: `import json
import pandas as pd

def process_data(input_data, processing_type):
    # Conversion des données en DataFrame
    df = pd.DataFrame(json.loads(input_data))
    
    if processing_type == 'analyse':
        return df.describe().to_json()
    elif processing_type == 'transformation':
        return df.to_json(orient='records')
    elif processing_type == 'filtrage':
        return df[df['value'] > 0].to_json(orient='records')
    
    return '{}'

result = process_data(input_data, processing_type)
print(result)`,
    execute: async (params) => {
      // Implémentation de l'exécution Python
      return 'Résultat Python';
    }
  },
  {
    id: 'notion-query',
    name: 'Requête Notion',
    description: 'Interroge une base de données Notion',
    language: 'typescript',
    params: [
      {
        id: 'database_id',
        name: 'ID Base de données',
        type: 'string',
        description: 'ID de la base Notion',
      },
      {
        id: 'filter_field',
        name: 'Champ de filtre',
        type: 'string',
        description: 'Champ pour filtrer les résultats',
      },
      {
        id: 'filter_value',
        name: 'Valeur du filtre',
        type: 'string',
        description: 'Valeur pour le filtrage',
      },
    ],
    template: `import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function queryDatabase(databaseId: string, filterField: string, filterValue: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: filterField,
      text: {
        equals: filterValue
      }
    }
  });
  
  return response.results;
}`,
    execute: async (params) => {
      // Implémentation de la requête Notion
      return 'Résultats Notion';
    }
  },
  {
    id: 'data-transform',
    name: 'Transformation de données',
    description: 'Transforme des données selon un format spécifique',
    language: 'typescript',
    params: [
      {
        id: 'input_format',
        name: 'Format d\'entrée',
        type: 'select',
        description: 'Format des données d\'entrée',
        options: ['json', 'csv', 'xml'],
      },
      {
        id: 'output_format',
        name: 'Format de sortie',
        type: 'select',
        description: 'Format des données de sortie',
        options: ['json', 'csv', 'xml'],
      },
    ],
    template: `interface DataTransformer {
  transform(data: string): string;
}

class JsonTransformer implements DataTransformer {
  transform(data: string): string {
    const parsed = JSON.parse(data);
    // Transformation personnalisée
    return JSON.stringify(parsed, null, 2);
  }
}

class CsvTransformer implements DataTransformer {
  transform(data: string): string {
    // Implémentation de la transformation CSV
    return data;
  }
}

class XmlTransformer implements DataTransformer {
  transform(data: string): string {
    // Implémentation de la transformation XML
    return data;
  }
}`,
    execute: async (params) => {
      // Implémentation de la transformation
      return 'Données transformées';
    }
  },
  {
    id: 'api-request',
    name: 'Requête API',
    description: 'Effectue une requête vers une API externe',
    language: 'typescript',
    params: [
      {
        id: 'url',
        name: 'URL',
        type: 'string',
        description: 'URL de l\'API',
      },
      {
        id: 'method',
        name: 'Méthode',
        type: 'select',
        description: 'Méthode HTTP',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      {
        id: 'headers',
        name: 'En-têtes',
        type: 'string',
        description: 'En-têtes HTTP (JSON)',
      },
    ],
    template: `async function makeRequest(url: string, method: string, headers: Record<string, string>) {
  const response = await fetch(url, {
    method,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(\`Erreur HTTP: \${response.status}\`);
  }
  
  return response.json();
}`,
    execute: async (params) => {
      // Implémentation de la requête API
      return 'Réponse API';
    }
  },
];

export interface WorkflowStep {
  triggerId: string;
  params: Record<string, any>;
  next?: string; // ID de l'étape suivante
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Record<string, WorkflowStep>;
  firstStepId: string;
}

export async function executeWorkflow(workflow: Workflow): Promise<string[]> {
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
  
  return results;
}
