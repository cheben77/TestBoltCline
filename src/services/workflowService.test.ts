import { WorkflowService } from './workflowService';
import { Workflow, TRIGGERS } from '../lib/triggers';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let mockWorkflow: Workflow;

  beforeEach(() => {
    service = new WorkflowService();
    mockWorkflow = {
      id: 'test-workflow',
      name: 'Test Workflow',
      description: 'A test workflow',
      firstStepId: 'step1',
      steps: {
        step1: {
          id: 'step1',
          name: 'Step 1',
          description: 'First step',
          triggerId: 'system-info',
          trigger: TRIGGERS['system-info'],
          params: { type: 'cpu' },
          nextStepId: 'step2'
        },
        step2: {
          id: 'step2',
          name: 'Step 2',
          description: 'Second step',
          triggerId: 'camera',
          trigger: TRIGGERS['camera'],
          params: { quality: 'high' }
        }
      },
      triggers: [
        {
          trigger: TRIGGERS['system-info'],
          params: { type: 'cpu' }
        },
        {
          trigger: TRIGGERS['camera'],
          params: { quality: 'high' }
        }
      ]
    };
  });

  describe('createWorkflow', () => {
    it('should create a new workflow with generated id', async () => {
      const { id, ...workflowWithoutId } = mockWorkflow;
      const result = await service.createWorkflow(workflowWithoutId as Workflow);
      
      expect(result.id).toBeDefined();
      expect(result.status).toBe('active');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve existing id when provided', async () => {
      const result = await service.createWorkflow(mockWorkflow);
      expect(result.id).toBe(mockWorkflow.id);
    });
  });

  describe('getWorkflow', () => {
    it('should return null for non-existent workflow', async () => {
      const result = await service.getWorkflow('non-existent');
      expect(result).toBeNull();
    });

    it('should return workflow when it exists', async () => {
      await service.createWorkflow(mockWorkflow);
      const result = await service.getWorkflow(mockWorkflow.id);
      expect(result).toMatchObject(mockWorkflow);
    });
  });

  describe('listWorkflows', () => {
    it('should return empty array when no workflows exist', async () => {
      const result = await service.listWorkflows();
      expect(result).toEqual([]);
    });

    it('should return all workflows', async () => {
      await service.createWorkflow(mockWorkflow);
      const result = await service.listWorkflows();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(mockWorkflow);
    });
  });

  describe('updateWorkflow', () => {
    it('should return null when workflow does not exist', async () => {
      const result = await service.updateWorkflow('non-existent', mockWorkflow);
      expect(result).toBeNull();
    });

    it('should update existing workflow', async () => {
      await service.createWorkflow(mockWorkflow);
      const updatedWorkflow = {
        ...mockWorkflow,
        name: 'Updated Workflow'
      };
      const result = await service.updateWorkflow(mockWorkflow.id, updatedWorkflow);
      expect(result?.name).toBe('Updated Workflow');
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('deleteWorkflow', () => {
    it('should return false when workflow does not exist', async () => {
      const result = await service.deleteWorkflow('non-existent');
      expect(result).toBe(false);
    });

    it('should delete existing workflow and its history', async () => {
      await service.createWorkflow(mockWorkflow);
      await service.executeWorkflow(mockWorkflow.id);
      
      const deleteResult = await service.deleteWorkflow(mockWorkflow.id);
      expect(deleteResult).toBe(true);
      
      const workflow = await service.getWorkflow(mockWorkflow.id);
      expect(workflow).toBeNull();
      
      const history = await service.getExecutionHistory(mockWorkflow.id);
      expect(history).toEqual([]);
    });
  });

  describe('executeWorkflow', () => {
    it('should execute all steps in order', async () => {
      await service.createWorkflow(mockWorkflow);
      const results = await service.executeWorkflow(mockWorkflow.id);
      
      expect(results).toHaveLength(2);
      expect(results[0].stepId).toBe('step1');
      expect(results[1].stepId).toBe('step2');
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle step execution failure', async () => {
      const failingWorkflow = {
        ...mockWorkflow,
        steps: {
          step1: {
            ...mockWorkflow.steps.step1,
            trigger: {
              ...TRIGGERS['system-info'],
              execute: async () => { throw new Error('Test error'); }
            }
          }
        }
      };

      await service.createWorkflow(failingWorkflow);
      const results = await service.executeWorkflow(failingWorkflow.id);
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBe('Test error');
    });

    it('should pass variables between steps', async () => {
      const workflow: Workflow = {
        ...mockWorkflow,
        steps: {
          step1: {
            ...mockWorkflow.steps.step1,
            trigger: {
              ...TRIGGERS['system-info'],
              execute: async () => ({ value: 42 })
            }
          },
          step2: {
            ...mockWorkflow.steps.step2,
            trigger: {
              ...TRIGGERS['camera'],
              execute: async ({ variables }) => ({ previousValue: variables.step1_result.value })
            }
          }
        }
      };

      await service.createWorkflow(workflow);
      const results = await service.executeWorkflow(workflow.id);
      
      expect(results[1].result.previousValue).toBe(42);
    });

    it('should throw error when workflow does not exist', async () => {
      await expect(service.executeWorkflow('non-existent')).rejects.toThrow('Workflow not found');
    });

    it('should prevent concurrent execution of same workflow', async () => {
      await service.createWorkflow(mockWorkflow);
      
      // Start first execution
      const execution1 = service.executeWorkflow(mockWorkflow.id);
      
      // Attempt second execution
      await expect(service.executeWorkflow(mockWorkflow.id)).rejects.toThrow('Workflow already running');
      
      // Wait for first execution to complete
      await execution1;
    });
  });

  describe('getExecutionHistory', () => {
    it('should return empty array for non-existent workflow', async () => {
      const history = await service.getExecutionHistory('non-existent');
      expect(history).toEqual([]);
    });

    it('should return execution history for workflow', async () => {
      await service.createWorkflow(mockWorkflow);
      await service.executeWorkflow(mockWorkflow.id);
      
      const history = await service.getExecutionHistory(mockWorkflow.id);
      expect(history).toHaveLength(2);
      expect(history[0].stepId).toBe('step1');
      expect(history[1].stepId).toBe('step2');
    });
  });

  describe('cancelExecution', () => {
    it('should return false when no execution exists', async () => {
      const result = await service.cancelExecution('non-existent');
      expect(result).toBe(false);
    });

    it('should cancel running execution', async () => {
      await service.createWorkflow(mockWorkflow);
      
      // Start execution in background
      const executionPromise = service.executeWorkflow(mockWorkflow.id);
      
      // Cancel execution
      const result = await service.cancelExecution(mockWorkflow.id);
      expect(result).toBe(true);
      
      // Wait for execution to complete
      const results = await executionPromise;
      expect(results[results.length - 1].success).toBe(false);
      expect(results[results.length - 1].error).toBe('Execution cancelled by user');
    });
  });
});
