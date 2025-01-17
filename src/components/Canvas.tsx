import React, { useState } from 'react';
import { Workflow, Trigger, TRIGGERS } from '../lib/triggers';
import WorkflowBuilder from './WorkflowBuilder';
import './Canvas.css';

interface Props {
  onSave?: (workflow: Workflow) => void;
  initialWorkflow?: Workflow | null;
}

const Canvas: React.FC<Props> = ({ onSave, initialWorkflow }) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(initialWorkflow || null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (workflow: Workflow) => {
    setWorkflow(workflow);
    setIsEditing(false);
    onSave?.(workflow);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="canvas">
      <div className="canvas-header">
        <h2>Éditeur de Workflow</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            {workflow ? 'Modifier' : 'Créer un workflow'}
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="canvas-content">
          <WorkflowBuilder
            onSave={handleSave}
            onCancel={handleCancel}
            initialWorkflow={workflow || undefined}
          />
        </div>
      ) : workflow ? (
        <div className="workflow-preview">
          <div className="workflow-header">
            <h3>{workflow.name}</h3>
            <span className={`status ${workflow.status}`}>{workflow.status}</span>
          </div>
          <p className="workflow-description">{workflow.description}</p>
          <div className="workflow-steps">
            {Object.values(workflow.steps).map(step => (
              <div key={step.id} className="workflow-step">
                <div className="step-header">
                  <h4>{step.name}</h4>
                  <span className="step-id">ID: {step.id}</span>
                </div>
                <p className="step-description">{step.description}</p>
                <div className="step-params">
                  {Object.entries(step.params).map(([key, value]) => (
                    <div key={key} className="param-item">
                      <span className="param-name">{key}:</span>
                      <span className="param-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
                {step.nextStepId && (
                  <div className="step-next">
                    Suivant: {workflow.steps[step.nextStepId]?.name || step.nextStepId}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="workflow-info">
            <div className="info-item">
              <span className="info-label">Créé le:</span>
              <span className="info-value">
                {workflow.createdAt ? new Date(workflow.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Modifié le:</span>
              <span className="info-value">
                {workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucun workflow créé</p>
          <p>Cliquez sur "Créer un workflow" pour commencer</p>
        </div>
      )}

      <div className="canvas-footer">
        <div className="triggers-list">
          <h3>Triggers Disponibles</h3>
          <div className="triggers-grid">
            {Object.values(TRIGGERS).map((trigger: Trigger) => (
              <div key={trigger.id} className="trigger-item">
                <h4>{trigger.name}</h4>
                <p>{trigger.description}</p>
                <div className="trigger-params">
                  {trigger.params.map(param => (
                    <div key={param.id} className="trigger-param">
                      <span className="param-name">{param.name}</span>
                      <span className="param-type">{param.type}</span>
                      {param.description && (
                        <p className="param-description">{param.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
