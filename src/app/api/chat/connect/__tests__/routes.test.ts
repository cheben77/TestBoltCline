import { NextRequest } from 'next/server';
import { GET as getOllama } from '../ollama/route';
import { GET as getNotion } from '../notion/route';
import { GET as getCuda } from '../cuda/route';
import { ollamaService } from '@/services/ollama';
import { notionService } from '@/services/notion';

// Mock des services
jest.mock('@/services/ollama');
jest.mock('@/services/notion');
jest.mock('child_process', () => ({
  exec: jest.fn(),
  promisify: jest.fn((fn) => fn)
}));

describe('Routes API de connexion', () => {
  const mockRequest = new NextRequest(new URL('http://localhost:3000/api/chat/connect'));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Route Ollama', () => {
    it('retourne connected: true quand des modèles sont disponibles', async () => {
      (ollamaService.getModels as jest.Mock).mockResolvedValue(['model1', 'model2']);

      const response = await getOllama(mockRequest);
      const data = await response.json();

      expect(data.connected).toBe(true);
      expect(ollamaService.getModels).toHaveBeenCalled();
    });

    it('gère les erreurs correctement', async () => {
      (ollamaService.getModels as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await getOllama(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erreur lors de la vérification d\'Ollama');
    });
  });

  describe('Route Notion', () => {
    it('retourne connected: true quand la base de données est accessible', async () => {
      (notionService.getProducts as jest.Mock).mockResolvedValue({
        results: [{ id: '1' }]
      });

      const response = await getNotion(mockRequest);
      const data = await response.json();

      expect(data.connected).toBe(true);
      expect(data.hasResults).toBe(true);
      expect(notionService.getProducts).toHaveBeenCalledWith({ page_size: 1 });
    });

    it('gère les erreurs correctement', async () => {
      (notionService.getProducts as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await getNotion(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erreur lors de la vérification de Notion');
    });
  });

  describe('Route CUDA', () => {
    it('retourne les informations CUDA quand disponible', async () => {
      const mockStdout = `
        NVIDIA-SMI 470.63.01    Driver Version: 470.63.01    CUDA Version: 11.4
        GPU 0: NVIDIA GeForce RTX 3080 (UUID: GPU-123)
        Memory:  8192MiB / 10240MiB
      `;

      // Mock de l'exécution de nvidia-smi
      const { exec } = require('child_process');
      (exec as jest.Mock).mockImplementation((_cmd: string, callback: Function) => {
        callback(null, { stdout: mockStdout });
      });

      const response = await getCuda(mockRequest);
      const data = await response.json();

      expect(data.available).toBe(true);
      expect(data.version).toBe('11.4');
      expect(data.gpuName).toBe('GeForce RTX 3080');
      expect(data.memoryUsed).toBe('8192MB');
      expect(data.memoryTotal).toBe('10240MB');
    });

    it('gère l\'absence de CUDA correctement', async () => {
      // Mock de l'erreur nvidia-smi
      const { exec } = require('child_process');
      (exec as jest.Mock).mockImplementation((_cmd: string, callback: Function) => {
        callback(new Error('nvidia-smi not found'));
      });

      const response = await getCuda(mockRequest);
      const data = await response.json();

      expect(data.available).toBe(false);
      expect(data.error).toBe('CUDA n\'est pas disponible sur ce système');
    });
  });
});
