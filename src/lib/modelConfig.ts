export type NumericModelParam = 
  | 'temperature'
  | 'top_p'
  | 'top_k'
  | 'repeat_penalty'
  | 'presence_penalty'
  | 'frequency_penalty'
  | 'mirostat'
  | 'mirostat_tau'
  | 'mirostat_eta'
  | 'seed'
  | 'num_predict'
  | 'num_ctx'
  | 'tfs_z'
  | 'typical_p'
  | 'repeat_last_n'
  | 'num_gpu'
  | 'num_thread'
  | 'num_batch'
  | 'num_keep';

export interface ModelParameters {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repeat_penalty?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  mirostat?: number;
  mirostat_tau?: number;
  mirostat_eta?: number;
  seed?: number;
  num_predict?: number;
  num_ctx?: number;
  stop?: string[];
  tfs_z?: number;
  typical_p?: number;
  repeat_last_n?: number;
  num_gpu?: number;
  num_thread?: number;
  num_batch?: number;
  num_keep?: number;
  ignore_eos?: boolean;
}

export interface ParamRange {
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  defaultParams: ModelParameters;
  paramRanges: {
    [K in keyof ModelParameters]?: ParamRange;
  };
}

const defaultParamRanges = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.1,
    description: 'Contrôle la créativité des réponses (0 = déterministe, >1 = plus créatif)'
  },
  top_p: {
    min: 0,
    max: 1,
    step: 0.05,
    description: 'Probabilité cumulative pour le sampling (nucleus sampling)'
  },
  top_k: {
    min: 1,
    max: 100,
    step: 1,
    description: 'Nombre de tokens les plus probables à considérer'
  },
  repeat_penalty: {
    min: 0.5,
    max: 2,
    step: 0.1,
    description: 'Pénalité pour la répétition de tokens'
  },
  presence_penalty: {
    min: -2,
    max: 2,
    step: 0.1,
    description: 'Pénalité pour les tokens déjà présents dans le contexte'
  },
  frequency_penalty: {
    min: -2,
    max: 2,
    step: 0.1,
    description: 'Pénalité basée sur la fréquence des tokens'
  },
  num_ctx: {
    min: 512,
    max: 8192,
    step: 512,
    description: 'Taille du contexte en tokens'
  },
  num_predict: {
    min: 32,
    max: 512,
    step: 32,
    description: 'Nombre maximum de tokens à générer'
  }
};

const defaultStopTokens = ['\n\n', 'Human:', 'Assistant:', 'User:', 'System:'];

export const modelConfigs: { [key: string]: ModelConfig } = {
  'llama2': {
    id: 'llama2',
    name: 'LLaMA 2',
    description: 'Modèle de langage généraliste optimisé pour la conversation',
    defaultParams: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      num_ctx: 4096,
      num_predict: 256,
      stop: defaultStopTokens,
      seed: -1
    },
    paramRanges: defaultParamRanges
  },
  'mistral': {
    id: 'mistral',
    name: 'Mistral',
    description: 'Modèle de langage performant pour la conversation et l\'analyse',
    defaultParams: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      num_ctx: 4096,
      num_predict: 256,
      stop: defaultStopTokens,
      seed: -1
    },
    paramRanges: defaultParamRanges
  },
  'codellama': {
    id: 'codellama',
    name: 'CodeLlama',
    description: 'Modèle spécialisé pour la programmation et l\'analyse de code',
    defaultParams: {
      temperature: 0.8,
      top_p: 0.95,
      top_k: 50,
      repeat_penalty: 1.15,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      num_ctx: 6144,
      num_predict: 384,
      stop: [...defaultStopTokens, '```'],
      seed: -1
    },
    paramRanges: defaultParamRanges
  },
  'neural-chat': {
    id: 'neural-chat',
    name: 'Neural Chat',
    description: 'Modèle optimisé pour le dialogue et l\'analyse',
    defaultParams: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      num_ctx: 4096,
      num_predict: 256,
      stop: defaultStopTokens,
      seed: -1
    },
    paramRanges: defaultParamRanges
  },
  'llava': {
    id: 'llava',
    name: 'LLaVA',
    description: 'Modèle multimodal pour l\'analyse d\'images et le dialogue',
    defaultParams: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      num_ctx: 4096,
      num_predict: 256,
      stop: defaultStopTokens,
      seed: -1
    },
    paramRanges: defaultParamRanges
  },
  'bakllava': {
    id: 'bakllava',
    name: 'BakLLaVA',
    description: 'Version optimisée de LLaVA pour l\'analyse d\'images',
    defaultParams: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      num_ctx: 4096,
      num_predict: 256,
      stop: defaultStopTokens,
      seed: -1
    },
    paramRanges: defaultParamRanges
  }
};

export function getModelConfig(modelId: string): ModelConfig | undefined {
  // Normaliser le nom du modèle en enlevant les tags
  const normalizedId = modelId.split(':')[0];
  return modelConfigs[normalizedId];
}

export function getDefaultParams(modelId: string): ModelParameters {
  // Normaliser le nom du modèle en enlevant les tags
  const normalizedId = modelId.split(':')[0];
  return modelConfigs[normalizedId]?.defaultParams || {};
}

function isNumericParam(key: keyof ModelParameters): key is NumericModelParam {
  return [
    'temperature', 'top_p', 'top_k', 'repeat_penalty',
    'presence_penalty', 'frequency_penalty', 'mirostat',
    'mirostat_tau', 'mirostat_eta', 'seed', 'num_predict',
    'num_ctx', 'tfs_z', 'typical_p', 'repeat_last_n',
    'num_gpu', 'num_thread', 'num_batch', 'num_keep'
  ].includes(key as string);
}

export function validateParams(modelId: string, params: ModelParameters): ModelParameters {
  // Normaliser le nom du modèle en enlevant les tags
  const normalizedId = modelId.split(':')[0];
  const config = modelConfigs[normalizedId];
  if (!config) return params;

  const validatedParams: ModelParameters = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    const paramKey = key as keyof ModelParameters;
    const range = config.paramRanges[paramKey];

    if (isNumericParam(paramKey) && typeof value === 'number') {
      if (range) {
        const min = range.min ?? -Infinity;
        const max = range.max ?? Infinity;
        validatedParams[paramKey] = Math.max(min, Math.min(max, value));
      } else {
        validatedParams[paramKey] = value;
      }
    } else {
      validatedParams[paramKey] = value;
    }
  });

  return validatedParams;
}
