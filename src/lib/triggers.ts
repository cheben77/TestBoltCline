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

export const TRIGGERS: Trigger[] = [
  {
    id: 'camera-capture',
    name: 'Capture Caméra',
    description: 'Capture une image ou une vidéo depuis la caméra',
    language: 'javascript',
    params: [
      {
        id: 'mode',
        name: 'Mode',
        type: 'select',
        description: 'Type de capture',
        options: ['photo', 'video'],
      },
      {
        id: 'duration',
        name: 'Durée (secondes)',
        type: 'number',
        description: 'Durée de l\'enregistrement vidéo',
      },
    ],
    template: `async function captureMedia(mode, duration) {
  const constraints = {
    video: true,
    audio: mode === 'video'
  };
  
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];
  
  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mode === 'video' ? 'video/webm' : 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    
    if (mode === 'video') {
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), duration * 1000);
    } else {
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      imageCapture.takePhoto()
        .then(blob => URL.createObjectURL(blob))
        .then(resolve)
        .catch(reject);
    }
  });
}`,
    execute: async () => 'URL du média capturé',
  },
  {
    id: 'audio-record',
    name: 'Enregistrement Audio',
    description: 'Enregistre de l\'audio via le microphone',
    language: 'javascript',
    params: [
      {
        id: 'duration',
        name: 'Durée (secondes)',
        type: 'number',
        description: 'Durée de l\'enregistrement',
      },
      {
        id: 'quality',
        name: 'Qualité',
        type: 'select',
        description: 'Qualité de l\'enregistrement',
        options: ['low', 'medium', 'high'],
      },
    ],
    template: `async function recordAudio(duration, quality) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];
  
  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), duration * 1000);
  });
}`,
    execute: async () => 'URL de l\'audio enregistré',
  },
  {
    id: 'wifi-scan',
    name: 'Scanner WiFi',
    description: 'Scanne les réseaux WiFi disponibles',
    language: 'javascript',
    params: [
      {
        id: 'filter',
        name: 'Filtre',
        type: 'string',
        description: 'Filtre par nom de réseau',
      },
    ],
    template: `async function scanWiFi(filter) {
  try {
    const networks = await navigator.wifi.getNetworks();
    return networks
      .filter(network => !filter || network.ssid.includes(filter))
      .map(network => ({
        ssid: network.ssid,
        signal: network.signalStrength,
        security: network.security
      }));
  } catch (error) {
    console.error('Erreur WiFi:', error);
    throw error;
  }
}`,
    execute: async () => 'Liste des réseaux WiFi',
  },
  {
    id: 'calendar-event',
    name: 'Événement Calendrier',
    description: 'Crée ou modifie un événement dans le calendrier',
    language: 'javascript',
    params: [
      {
        id: 'title',
        name: 'Titre',
        type: 'string',
        description: 'Titre de l\'événement',
      },
      {
        id: 'start',
        name: 'Début',
        type: 'string',
        description: 'Date et heure de début',
      },
      {
        id: 'duration',
        name: 'Durée (minutes)',
        type: 'number',
        description: 'Durée de l\'événement',
      },
    ],
    template: `async function createCalendarEvent(title, start, duration) {
  const event = {
    title,
    start: new Date(start),
    end: new Date(new Date(start).getTime() + duration * 60000),
    description: 'Créé via StoaViva'
  };
  
  if ('calendar' in navigator && 'createEvent' in navigator.calendar) {
    return await navigator.calendar.createEvent(event);
  } else {
    const icsContent = generateICS(event);
    downloadICS(icsContent);
    return 'Fichier ICS généré';
  }
}`,
    execute: async () => 'ID de l\'événement créé',
  },
  {
    id: 'notification',
    name: 'Notification',
    description: 'Envoie une notification système',
    language: 'javascript',
    params: [
      {
        id: 'title',
        name: 'Titre',
        type: 'string',
        description: 'Titre de la notification',
      },
      {
        id: 'message',
        name: 'Message',
        type: 'string',
        description: 'Contenu de la notification',
      },
      {
        id: 'type',
        name: 'Type',
        type: 'select',
        description: 'Type de notification',
        options: ['info', 'success', 'warning', 'error'],
      },
    ],
    template: `async function showNotification(title, message, type) {
  if (!('Notification' in window)) {
    throw new Error('Notifications non supportées');
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    return new Notification(title, {
      body: message,
      icon: \`/icons/\${type}.png\`
    });
  } else {
    throw new Error('Permission refusée');
  }
}`,
    execute: async () => 'Notification envoyée',
  },
  {
    id: 'geolocation',
    name: 'Géolocalisation',
    description: 'Obtient la position actuelle',
    language: 'javascript',
    params: [
      {
        id: 'accuracy',
        name: 'Précision',
        type: 'select',
        description: 'Niveau de précision',
        options: ['low', 'medium', 'high'],
      },
      {
        id: 'timeout',
        name: 'Timeout (secondes)',
        type: 'number',
        description: 'Délai maximum',
      },
    ],
    template: `async function getLocation(accuracy, timeout) {
  const options = {
    enableHighAccuracy: accuracy === 'high',
    timeout: timeout * 1000,
    maximumAge: 0
  };
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      reject,
      options
    );
  });
}`,
    execute: async () => 'Position GPS',
  },
  {
    id: 'bluetooth-scan',
    name: 'Scanner Bluetooth',
    description: 'Recherche les appareils Bluetooth',
    language: 'javascript',
    params: [
      {
        id: 'filter',
        name: 'Filtre',
        type: 'string',
        description: 'Filtre par nom d\'appareil',
      },
      {
        id: 'duration',
        name: 'Durée (secondes)',
        type: 'number',
        description: 'Durée du scan',
      },
    ],
    template: `async function scanBluetooth(filter, duration) {
  try {
    const devices = await navigator.bluetooth.requestDevice({
      acceptAllDevices: !filter,
      filters: filter ? [{ name: filter }] : undefined,
      optionalServices: ['generic_access']
    });
    
    return {
      name: devices.name,
      id: devices.id,
      connected: devices.gatt.connected
    };
  } catch (error) {
    console.error('Erreur Bluetooth:', error);
    throw error;
  }
}`,
    execute: async () => 'Liste des appareils Bluetooth',
  },
  {
    id: 'screen-capture',
    name: 'Capture d\'écran',
    description: 'Capture l\'écran ou une fenêtre',
    language: 'javascript',
    params: [
      {
        id: 'type',
        name: 'Type',
        type: 'select',
        description: 'Type de capture',
        options: ['screen', 'window', 'application'],
      },
      {
        id: 'format',
        name: 'Format',
        type: 'select',
        description: 'Format de sortie',
        options: ['png', 'jpeg', 'webp'],
      },
    ],
    template: `async function captureScreen(type, format) {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: false
    });
    
    const track = stream.getVideoTracks()[0];
    const capture = new ImageCapture(track);
    const bitmap = await capture.grabFrame();
    
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(URL.createObjectURL(blob)),
        \`image/\${format}\`
      );
    });
  } finally {
    stream?.getTracks().forEach(track => track.stop());
  }
}`,
    execute: async () => 'URL de la capture d\'écran',
  },
  {
    id: 'file-system',
    name: 'Système de fichiers',
    description: 'Accède aux fichiers système',
    language: 'javascript',
    params: [
      {
        id: 'operation',
        name: 'Opération',
        type: 'select',
        description: 'Type d\'opération',
        options: ['read', 'write', 'delete', 'list'],
      },
      {
        id: 'path',
        name: 'Chemin',
        type: 'string',
        description: 'Chemin du fichier/dossier',
      },
    ],
    template: `async function handleFileSystem(operation, path) {
  const handle = await window.showDirectoryPicker();
  
  switch (operation) {
    case 'read':
      const file = await handle.getFileHandle(path);
      const content = await file.getFile();
      return await content.text();
      
    case 'write':
      const newFile = await handle.getFileHandle(path, { create: true });
      const writable = await newFile.createWritable();
      await writable.write(new Blob(['Hello World']));
      await writable.close();
      return 'Fichier créé';
      
    case 'delete':
      await handle.removeEntry(path);
      return 'Fichier supprimé';
      
    case 'list':
      const entries = [];
      for await (const entry of handle.values()) {
        entries.push({
          name: entry.name,
          type: entry.kind
        });
      }
      return entries;
  }
}`,
    execute: async () => 'Résultat de l\'opération',
  },
  {
    id: 'speech-recognition',
    name: 'Reconnaissance vocale',
    description: 'Convertit la parole en texte',
    language: 'javascript',
    params: [
      {
        id: 'language',
        name: 'Langue',
        type: 'select',
        description: 'Langue de reconnaissance',
        options: ['fr-FR', 'en-US', 'es-ES', 'de-DE'],
      },
      {
        id: 'duration',
        name: 'Durée (secondes)',
        type: 'number',
        description: 'Durée de l\'écoute',
      },
    ],
    template: `async function recognizeSpeech(language, duration) {
  return new Promise((resolve, reject) => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    
    let transcript = '';
    
    recognition.onresult = (event) => {
      transcript += event.results[event.results.length - 1][0].transcript;
    };
    
    recognition.onerror = reject;
    recognition.onend = () => resolve(transcript);
    
    recognition.start();
    setTimeout(() => recognition.stop(), duration * 1000);
  });
}`,
    execute: async () => 'Texte reconnu',
  },
];

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
