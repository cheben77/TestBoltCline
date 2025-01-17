import React, { useState } from 'react';
import { Workflow, WorkflowStep, Trigger, TriggerParam, TRIGGERS } from '../lib/triggers';

interface Props {
  onSave: (workflow: Workflow) => void;
  onCancel?: () => void;
  initialWorkflow?: Workflow;
}

const WorkflowBuilder: React.FC<Props> = ({ onSave, onCancel, initialWorkflow }) => {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow || {
    id: Math.random().toString(36).substring(7),
    name: '',
    description: '',
    firstStepId: '',
    steps: {},
    triggers: [],
    status: 'inactive',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const addStep = (trigger: Trigger) => {
    const stepId = Math.random().toString(36).substring(7);
    const step: WorkflowStep = {
      id: stepId,
      name: trigger.name,
      description: trigger.description,
      triggerId: trigger.id,
      trigger: trigger,
      params: {},
      nextStepId: undefined
    };

    setWorkflow(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepId]: step
      },
      firstStepId: prev.firstStepId || stepId
    }));
  };

  const updateStepParams = (stepId: string, params: Record<string, any>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepId]: {
          ...prev.steps[stepId],
          params
        }
      }
    }));
  };

  const handleSave = () => {
    onSave({
      ...workflow,
      updatedAt: new Date()
    });
  };

  return (
    <div className="workflow-builder">
      <div className="header">
        <input
          type="text"
          placeholder="Nom du workflow"
          value={workflow.name}
          onChange={e => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          value={workflow.description}
          onChange={e => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="steps">
        {Object.values(workflow.steps).map(step => (
          <div key={step.id} className="step">
            <h3>{step.name}</h3>
            <p>{step.description}</p>
            {step.trigger.params.map(param => (
              <div key={param.id} className="param">
                <label>{param.name}</label>
                {param.type === 'select' ? (
                  <select
                    value={step.params[param.id] || param.default}
                    onChange={e => updateStepParams(step.id, {
                      ...step.params,
                      [param.id]: e.target.value
                    })}
                  >
                    {param.options?.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={param.type}
                    value={step.params[param.id] || param.default || ''}
                    onChange={e => updateStepParams(step.id, {
                      ...step.params,
                      [param.id]: e.target.value
                    })}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="triggers">
        <h3>Triggers Disponibles</h3>
        {Object.values(TRIGGERS).map(trigger => (
          <button
            key={trigger.id}
            onClick={() => addStep(trigger)}
            className="trigger-button"
          >
            {trigger.name}
          </button>
        ))}
      </div>

      <div className="actions">
        <button onClick={handleSave} className="save-button">
          Sauvegarder
        </button>
        {onCancel && (
          <button onClick={onCancel} className="cancel-button">
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
