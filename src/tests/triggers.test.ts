import { SystemInfo, CameraStream, VideoEffects, MotionDetection, FaceDetection, QRScanner } from '../lib/triggers';

describe('System Info Trigger', () => {
  const systemInfo = new SystemInfo();

  test('should get CPU usage', async () => {
    const cpuInfo = await systemInfo.getCPUInfo();
    expect(cpuInfo).toBeDefined();
    expect(cpuInfo.usage).toBeGreaterThanOrEqual(0);
    expect(cpuInfo.usage).toBeLessThanOrEqual(100);
  });

  test('should get memory info', async () => {
    const memoryInfo = await systemInfo.getMemoryInfo();
    expect(memoryInfo).toBeDefined();
    expect(memoryInfo.total).toBeGreaterThan(0);
    expect(memoryInfo.used).toBeLessThanOrEqual(memoryInfo.total);
  });
});

describe('Camera Stream', () => {
  const camera = new CameraStream();

  test('should initialize camera stream', async () => {
    const stream = await camera.initialize();
    expect(stream).toBeDefined();
    expect(stream.active).toBe(true);
  });

  test('should change camera quality', () => {
    camera.setQuality('high');
    expect(camera.currentQuality).toBe('high');
    expect(camera.resolution.width).toBeGreaterThanOrEqual(1280);
  });
});

describe('Video Effects', () => {
  const effects = new VideoEffects();

  test('should apply blur effect', () => {
    const result = effects.applyEffect('blur', { intensity: 50 });
    expect(result.applied).toBe(true);
    expect(result.effect).toBe('blur');
    expect(result.params.intensity).toBe(50);
  });

  test('should validate effect parameters', () => {
    expect(() => {
      effects.applyEffect('blur', { intensity: 150 });
    }).toThrow('Intensity must be between 0 and 100');
  });
});

describe('Motion Detection', () => {
  const detector = new MotionDetection();

  test('should detect motion', async () => {
    const result = await detector.analyze(mockFrameData);
    expect(result.hasMotion).toBeDefined();
    expect(result.regions).toBeInstanceOf(Array);
  });

  test('should adjust sensitivity', () => {
    detector.setSensitivity(75);
    expect(detector.sensitivity).toBe(75);
    expect(detector.threshold).toBeGreaterThan(0);
  });
});

describe('Face Detection', () => {
  const faceDetector = new FaceDetection();

  test('should detect faces', async () => {
    const result = await faceDetector.detect(mockImageData);
    expect(result.faces).toBeInstanceOf(Array);
    expect(result.count).toBeGreaterThanOrEqual(0);
  });

  test('should detect facial landmarks', async () => {
    const result = await faceDetector.detectLandmarks(mockImageData);
    expect(result.landmarks).toBeDefined();
    expect(result.landmarks.eyes).toBeDefined();
  });
});

describe('QR Scanner', () => {
  const scanner = new QRScanner();

  test('should scan QR code', async () => {
    const result = await scanner.scan(mockImageData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('should handle multiple formats', async () => {
    scanner.setFormat('all');
    const result = await scanner.scan(mockImageData);
    expect(result.format).toBeDefined();
    expect(['qr', 'barcode']).toContain(result.format);
  });
});

// Mock data pour les tests
const mockFrameData = new Uint8Array([/* ... données d'image simulées ... */]);
const mockImageData = new Uint8Array([/* ... données d'image simulées ... */]);
