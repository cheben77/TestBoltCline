export interface TriggerParam {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  options?: string[];
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

export interface WorkflowStep {
  triggerId: string;
  params: Record<string, any>;
  next?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Record<string, WorkflowStep>;
  firstStepId: string;
}

export const TRIGGERS: Trigger[] = [
  {
    id: 'system-info',
    name: 'Informations Système',
    description: 'Récupère les informations système',
    language: 'javascript',
    params: [
      {
        id: 'type',
        name: 'Type',
        type: 'select',
        description: 'Type d\'information',
        options: ['cpu', 'memory', 'battery', 'network', 'storage'],
      },
    ],
    template: `async function getSystemInfo(type) {
  switch (type) {
    case 'cpu':
      const cpuInfo = await navigator.deviceMemory;
      return { cores: navigator.hardwareConcurrency, memory: cpuInfo };
      
    case 'memory':
      const memory = performance.memory;
      return {
        total: memory.jsHeapSizeLimit,
        used: memory.usedJSHeapSize,
        available: memory.jsHeapSizeLimit - memory.usedJSHeapSize
      };
      
    case 'battery':
      const battery = await navigator.getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
        time: battery.dischargingTime
      };
      
    case 'network':
      const connection = navigator.connection;
      return {
        type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
      
    case 'storage':
      const storage = await navigator.storage.estimate();
      return {
        quota: storage.quota,
        usage: storage.usage,
        available: storage.quota - storage.usage
      };
  }
}`,
    execute: async () => 'Informations système',
  },
  {
    id: 'camera-stream',
    name: 'Flux Caméra',
    description: 'Gère le flux vidéo de la caméra',
    language: 'javascript',
    params: [
      {
        id: 'mode',
        name: 'Mode',
        type: 'select',
        description: 'Mode de capture',
        options: ['photo', 'video', 'stream'],
      },
      {
        id: 'camera',
        name: 'Caméra',
        type: 'select',
        description: 'Sélection de la caméra',
        options: ['user', 'environment'],
      },
      {
        id: 'quality',
        name: 'Qualité',
        type: 'select',
        description: 'Qualité de capture',
        options: ['low', 'medium', 'high', '4k'],
      },
    ],
    template: `async function handleCamera(mode, camera, quality) {
  const constraints = {
    video: {
      facingMode: camera,
      width: quality === '4k' ? 3840 : quality === 'high' ? 1920 : quality === 'medium' ? 1280 : 640,
      height: quality === '4k' ? 2160 : quality === 'high' ? 1080 : quality === 'medium' ? 720 : 480,
    },
    audio: mode === 'video'
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
  switch (mode) {
    case 'photo':
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const photo = await imageCapture.takePhoto();
      track.stop();
      return URL.createObjectURL(photo);
      
    case 'video':
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      return new Promise((resolve) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(URL.createObjectURL(blob));
        };
        
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);
      });
      
    case 'stream':
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      return 'Flux vidéo démarré';
  }
}`,
    execute: async () => 'Opération caméra effectuée',
  },
  {
    id: 'video-effects',
    name: 'Effets Vidéo',
    description: 'Applique des effets au flux vidéo',
    language: 'javascript',
    params: [
      {
        id: 'effect',
        name: 'Effet',
        type: 'select',
        description: 'Type d\'effet',
        options: ['blur', 'grayscale', 'sepia', 'invert', 'custom'],
      },
      {
        id: 'intensity',
        name: 'Intensité',
        type: 'number',
        description: 'Intensité de l\'effet (0-100)',
      },
      {
        id: 'customFilter',
        name: 'Filtre personnalisé',
        type: 'string',
        description: 'CSS filter personnalisé',
      },
    ],
    template: `async function applyVideoEffect(effect, intensity, customFilter) {
  const video = document.querySelector('video');
  if (!video) throw new Error('Aucun flux vidéo actif');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const normalizedIntensity = intensity / 100;
  
  let filter = '';
  switch (effect) {
    case 'blur':
      filter = \`blur(\${normalizedIntensity * 20}px)\`;
      break;
    case 'grayscale':
      filter = \`grayscale(\${normalizedIntensity})\`;
      break;
    case 'sepia':
      filter = \`sepia(\${normalizedIntensity})\`;
      break;
    case 'invert':
      filter = \`invert(\${normalizedIntensity})\`;
      break;
    case 'custom':
      filter = customFilter;
      break;
  }
  
  ctx.filter = filter;
  ctx.drawImage(video, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}`,
    execute: async () => 'Effet appliqué',
  },
  {
    id: 'motion-detection',
    name: 'Détection de mouvement',
    description: 'Détecte les mouvements dans le flux vidéo',
    language: 'javascript',
    params: [
      {
        id: 'sensitivity',
        name: 'Sensibilité',
        type: 'number',
        description: 'Seuil de détection (1-100)',
      },
      {
        id: 'region',
        name: 'Région',
        type: 'string',
        description: 'Zone de détection (x,y,w,h)',
      },
    ],
    template: `async function detectMotion(sensitivity, region) {
  const video = document.querySelector('video');
  if (!video) throw new Error('Aucun flux vidéo actif');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  let lastFrame = null;
  const threshold = (100 - sensitivity) / 100;
  
  const [x, y, w, h] = region.split(',').map(Number);
  
  return new Promise((resolve) => {
    const detect = () => {
      ctx.drawImage(video, 0, 0);
      const frame = ctx.getImageData(x, y, w, h);
      
      if (lastFrame) {
        let changes = 0;
        for (let i = 0; i < frame.data.length; i += 4) {
          const diff = Math.abs(frame.data[i] - lastFrame.data[i]) / 255;
          if (diff > threshold) changes++;
        }
        
        if (changes / (frame.data.length / 4) > 0.2) {
          resolve('Mouvement détecté');
          return;
        }
      }
      
      lastFrame = frame;
      requestAnimationFrame(detect);
    };
    
    detect();
  });
}`,
    execute: async () => 'Détection de mouvement activée',
  },
  {
    id: 'face-detection',
    name: 'Détection de visage',
    description: 'Détecte les visages dans l\'image',
    language: 'javascript',
    params: [
      {
        id: 'mode',
        name: 'Mode',
        type: 'select',
        description: 'Mode de détection',
        options: ['single', 'multiple', 'landmarks'],
      },
      {
        id: 'minSize',
        name: 'Taille minimum',
        type: 'number',
        description: 'Taille minimum du visage',
      },
    ],
    template: `async function detectFaces(mode, minSize) {
  const video = document.querySelector('video');
  if (!video) throw new Error('Aucun flux vidéo actif');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  const faceDetector = new FaceDetector({
    maxDetectedFaces: mode === 'multiple' ? 10 : 1,
    fastMode: true
  });
  
  const faces = await faceDetector.detect(canvas);
  
  if (mode === 'landmarks' && faces.length > 0) {
    const landmarks = await faces[0].landmarks;
    return {
      count: faces.length,
      landmarks: landmarks.map(l => ({
        type: l.type,
        points: l.points
      }))
    };
  }
  
  return {
    count: faces.length,
    locations: faces.map(f => ({
      x: f.boundingBox.x,
      y: f.boundingBox.y,
      width: f.boundingBox.width,
      height: f.boundingBox.height
    }))
  };
}`,
    execute: async () => 'Détection de visage effectuée',
  },
  {
    id: 'qr-scanner',
    name: 'Scanner QR Code',
    description: 'Scanne les QR codes via la caméra',
    language: 'javascript',
    params: [
      {
        id: 'mode',
        name: 'Mode',
        type: 'select',
        description: 'Mode de scan',
        options: ['single', 'continuous'],
      },
      {
        id: 'format',
        name: 'Format',
        type: 'select',
        description: 'Format de code',
        options: ['qr', 'barcode', 'all'],
      },
    ],
    template: `async function scanQRCode(mode, format) {
  const video = document.querySelector('video');
  if (!video) throw new Error('Aucun flux vidéo actif');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const barcodeDetector = new BarcodeDetector({
    formats: format === 'all' ? ['qr_code', 'ean_13', 'ean_8', 'code_128'] :
             format === 'barcode' ? ['ean_13', 'ean_8', 'code_128'] :
             ['qr_code']
  });
  
  if (mode === 'continuous') {
    return new Promise((resolve) => {
      const scan = async () => {
        ctx.drawImage(video, 0, 0);
        const codes = await barcodeDetector.detect(canvas);
        
        if (codes.length > 0) {
          resolve(codes.map(code => ({
            format: code.format,
            value: code.rawValue
          })));
          return;
        }
        
        requestAnimationFrame(scan);
      };
      
      scan();
    });
  } else {
    ctx.drawImage(video, 0, 0);
    const codes = await barcodeDetector.detect(canvas);
    return codes.map(code => ({
      format: code.format,
      value: code.rawValue
    }));
  }
}`,
    execute: async () => 'Scan QR code effectué',
  },
];

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
