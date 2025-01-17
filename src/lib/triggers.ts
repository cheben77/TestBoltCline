export interface TriggerParam {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  default?: any;
  options?: string[];
  required?: boolean;
  description?: string;
}

export type TriggerExecuteFunction = (params: Record<string, any>) => Promise<any>;

export interface Trigger {
  id: string;
  name: string;
  description: string;
  params: TriggerParam[];
  execute: TriggerExecuteFunction;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  triggerId: string;
  trigger: Trigger;
  params: Record<string, any>;
  nextStepId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  firstStepId: string;
  steps: Record<string, WorkflowStep>;
  triggers: {
    trigger: Trigger;
    params: Record<string, any>;
  }[];
  status?: 'active' | 'inactive' | 'error';
  createdAt?: Date;
  updatedAt?: Date;
}

export const TRIGGERS: Record<string, Trigger> = {
  'system-info': {
    id: 'system-info',
    name: 'Informations Système',
    description: 'Récupère les informations système',
    params: [
      {
        id: 'type',
        name: 'Type',
        type: 'select',
        options: ['cpu', 'memory', 'battery', 'network', 'storage'],
        required: true,
        description: 'Type d\'information à récupérer'
      }
    ],
    execute: async (params) => {
      const systemInfo = new SystemInfo();
      switch (params.type) {
        case 'cpu':
          return systemInfo.getCPUInfo();
        case 'memory':
          return systemInfo.getMemoryInfo();
        default:
          throw new Error(`Type non supporté: ${params.type}`);
      }
    }
  },
  'camera': {
    id: 'camera',
    name: 'Flux Caméra',
    description: 'Gère le flux vidéo de la caméra',
    params: [
      {
        id: 'quality',
        name: 'Qualité',
        type: 'select',
        options: ['low', 'medium', 'high', '4k'],
        default: 'medium',
        description: 'Qualité du flux vidéo'
      }
    ],
    execute: async (params) => {
      const camera = new CameraStream();
      await camera.initialize();
      if (params.quality) {
        camera.setQuality(params.quality);
      }
      return camera;
    }
  }
};

export class SystemInfo {
  async getCPUInfo() {
    return {
      usage: Math.floor(Math.random() * 100),
      cores: 8,
      speed: '3.2 GHz'
    };
  }

  async getMemoryInfo() {
    const total = 16384;
    const used = Math.floor(Math.random() * total);
    return { total, used, free: total - used };
  }
}

export class CameraStream {
  private active = false;
  public currentQuality = 'medium';
  public resolution = { width: 1280, height: 720 };

  async initialize() {
    this.active = true;
    return {
      active: this.active,
      resolution: this.resolution
    };
  }

  setQuality(quality: 'low' | 'medium' | 'high' | '4k') {
    this.currentQuality = quality;
    switch (quality) {
      case 'low':
        this.resolution = { width: 640, height: 480 };
        break;
      case 'medium':
        this.resolution = { width: 1280, height: 720 };
        break;
      case 'high':
        this.resolution = { width: 1920, height: 1080 };
        break;
      case '4k':
        this.resolution = { width: 3840, height: 2160 };
        break;
    }
    return this.resolution;
  }
}

export class VideoEffects {
  applyEffect(effect: string, params: { intensity?: number }) {
    if (params.intensity !== undefined && (params.intensity < 0 || params.intensity > 100)) {
      throw new Error('Intensity must be between 0 and 100');
    }

    return {
      applied: true,
      effect,
      params
    };
  }
}

export class MotionDetection {
  public sensitivity = 50;
  public threshold = 0.2;

  setSensitivity(value: number) {
    this.sensitivity = value;
    this.threshold = value / 250;
  }

  async analyze(frameData: Uint8Array) {
    return {
      hasMotion: Math.random() > 0.5,
      regions: [
        { x: 100, y: 100, width: 50, height: 50 }
      ]
    };
  }
}

export class FaceDetection {
  async detect(imageData: Uint8Array) {
    return {
      faces: [
        { x: 100, y: 100, width: 100, height: 100 }
      ],
      count: 1
    };
  }

  async detectLandmarks(imageData: Uint8Array) {
    return {
      landmarks: {
        eyes: [
          { x: 120, y: 120 },
          { x: 180, y: 120 }
        ],
        nose: { x: 150, y: 150 },
        mouth: { x: 150, y: 180 }
      }
    };
  }
}

export class QRScanner {
  private format: 'qr' | 'barcode' | 'all' = 'qr';

  setFormat(format: 'qr' | 'barcode' | 'all') {
    this.format = format;
  }

  async scan(imageData: Uint8Array) {
    return {
      success: true,
      format: this.format === 'all' ? 
        (Math.random() > 0.5 ? 'qr' : 'barcode') : 
        this.format,
      data: 'https://example.com'
    };
  }
}
