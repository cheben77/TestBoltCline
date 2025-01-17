import { Workflow } from '../lib/triggers';

type WorkflowStatus = 'active' | 'inactive' | 'error';
type ExecutionStatus = 'running' | 'completed' | 'failed';

interface ExecutionResult {
  stepId: string;
  success: boolean;
  result?: any;
  error?: string;
  timestamp: Date;
}

interface WorkflowExecutionContext {
  workflowId: string;
  startTime: Date;
  variables: Record<string, any>;
  status: ExecutionStatus;
  currentStepId?: string;
  error?: string;
}

export class WorkflowService {
  private workflows: Map<string, Workflow> = new Map();
  private executionHistory: Map<string, ExecutionResult[]> = new Map();
  private activeExecutions: Map<string, WorkflowExecutionContext> = new Map();

  async createWorkflow(workflow: Workflow): Promise<Workflow> {
    const id = workflow.id || Math.random().toString(36).substring(7);
    const newWorkflow = {
      ...workflow,
      id,
      status: 'active' as WorkflowStatus,
      createdAt: workflow.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.workflows.set(id, newWorkflow as Workflow);
    return newWorkflow as Workflow;
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    return this.workflows.get(id) || null;
  }

  async listWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }

  async updateWorkflow(id: string, workflow: Workflow): Promise<Workflow | null> {
    if (!this.workflows.has(id)) {
      return null;
    }
    const updatedWorkflow = {
      ...workflow,
      id,
      status: workflow.status || 'active' as WorkflowStatus,
      updatedAt: new Date()
    };
    this.workflows.set(id, updatedWorkflow as Workflow);
    return updatedWorkflow as Workflow;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.executionHistory.delete(id);
    }
    return deleted;
  }

  async executeWorkflow(id: string, initialVariables: Record<string, any> = {}): Promise<ExecutionResult[]> {
    const workflow = await this.getWorkflow(id);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Vérifier si le workflow est déjà en cours d'exécution
    if (this.activeExecutions.has(id)) {
      throw new Error('Workflow already running');
    }

    const context: WorkflowExecutionContext = {
      workflowId: id,
      startTime: new Date(),
      variables: { ...initialVariables },
      status: 'running',
      currentStepId: workflow.firstStepId || undefined
    };

    this.activeExecutions.set(id, context);
    const results: ExecutionResult[] = [];

    try {
      while (context.currentStepId) {
        const step = workflow.steps[context.currentStepId];
        if (!step) {
          throw new Error(`Step ${context.currentStepId} not found`);
        }

        try {
          const result = await step.trigger.execute({
            ...step.params,
            variables: context.variables
          });

          results.push({
            stepId: context.currentStepId,
            success: true,
            result,
            timestamp: new Date()
          });

          // Mettre à jour les variables avec le résultat
          context.variables = {
            ...context.variables,
            [`${step.name}_result`]: result
          };

          context.currentStepId = step.nextStepId;
        } catch (error) {
          const executionError: ExecutionResult = {
            stepId: context.currentStepId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date()
          };
          results.push(executionError);
          
          context.status = 'failed';
          context.error = executionError.error;
          break;
        }
      }

      if (context.status !== 'failed') {
        context.status = 'completed';
      }

      // Sauvegarder l'historique d'exécution
      const history = this.executionHistory.get(id) || [];
      history.push(...results);
      this.executionHistory.set(id, history);

      return results;
    } finally {
      this.activeExecutions.delete(id);
    }
  }

  async getExecutionHistory(id: string): Promise<ExecutionResult[]> {
    return this.executionHistory.get(id) || [];
  }

  async getActiveExecutions(): Promise<WorkflowExecutionContext[]> {
    return Array.from(this.activeExecutions.values());
  }

  async cancelExecution(id: string): Promise<boolean> {
    const execution = this.activeExecutions.get(id);
    if (!execution) {
      return false;
    }

    execution.status = 'failed';
    execution.error = 'Execution cancelled by user';
    this.activeExecutions.delete(id);
    return true;
  }
}

export const workflowService = new WorkflowService();
