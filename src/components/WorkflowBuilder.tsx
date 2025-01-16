'use client';

import { useState, useEffect } from 'react';
import { Trigger, TriggerParam, Workflow, WorkflowStep } from '@/lib/triggers';

interface WorkflowBuilderProps {
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

export default function WorkflowBuilder({ onSave, onCancel }: WorkflowBuilderProps) {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [steps, setSteps] = useState<Record<string, WorkflowStep>>({});
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [firstStepId, setFirstStepId] = useState<string>('');

  useEffect(() => {
    loadTriggers();
  }, []);

  const loadTriggers = async () => {
    try {
      const response = await fetch('/api/triggers');
      const data = await response.json();
      setTriggers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des triggers:', error);
    }
  };

  const addStep = () => {
    const stepId = `step-${Date.now()}`;
    setSteps(prev => ({
      ...prev,
      [stepId]: {
        triggerId: '',
        params: {},
      }
    }));
    if (!firstStepId) {
      setFirstStepId(stepId);
    }
    setSelectedStepId(stepId);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...updates,
      }
    }));
  };

  const removeStep = (stepId: string) => {
    setSteps(prev => {
      const { [stepId]: removed, ...rest } = prev;
      return rest;
    });
    if (firstStepId === stepId) {
      const remainingSteps = Object.keys(steps).filter(id => id !== stepId);
      setFirstStepId(remainingSteps[0] || '');
    }
  };

  const handleSave = () => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      steps,
      firstStepId,
    };
    onSave(workflow);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Créer un Workflow</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3 border-r pr-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Étapes</h3>
            <button
              onClick={addStep}
              className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(steps).map(([stepId, step]) => (
              <div
                key={stepId}
                className={`p-2 border rounded cursor-pointer ${
                  selectedStepId === stepId ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedStepId(stepId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">
                      {triggers.find(t => t.id === step.triggerId)?.name || 'Nouvelle étape'}
                    </div>
                    {stepId === firstStepId && (
                      <div className="text-xs text-green-600">Première étape</div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(stepId);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {selectedStepId && steps[selectedStepId] && (
            <div>
              <h3 className="font-medium mb-4">Configuration de l'étape</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trigger</label>
                  <select
                    value={steps[selectedStepId].triggerId}
                    onChange={(e) => updateStep(selectedStepId, { triggerId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Sélectionner un trigger</option>
                    {triggers.map(trigger => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </select>
                </div>

                {steps[selectedStepId].triggerId && (
                  <div className="space-y-4">
                    {triggers
                      .find(t => t.id === steps[selectedStepId].triggerId)
                      ?.params.map(param => (
                        <div key={param.id}>
                          <label className="block text-sm font-medium text-gray-700">
                            {param.name}
                          </label>
                          {param.type === 'select' ? (
                            <select
                              value={steps[selectedStepId].params[param.id] || ''}
                              onChange={(e) =>
                                updateStep(selectedStepId, {
                                  params: {
                                    ...steps[selectedStepId].params,
                                    [param.id]: e.target.value,
                                  },
                                })
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                              <option value="">Sélectionner une option</option>
                              {param.options?.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={param.type === 'number' ? 'number' : 'text'}
                              value={steps[selectedStepId].params[param.id] || ''}
                              onChange={(e) =>
                                updateStep(selectedStepId, {
                                  params: {
                                    ...steps[selectedStepId].params,
                                    [param.id]: e.target.value,
                                  },
                                })
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                          )}
                          <p className="mt-1 text-sm text-gray-500">{param.description}</p>
                        </div>
                      ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Étape suivante
                      </label>
                      <select
                        value={steps[selectedStepId].next || ''}
                        onChange={(e) =>
                          updateStep(selectedStepId, { next: e.target.value || undefined })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="">Fin du workflow</option>
                        {Object.keys(steps)
                          .filter(id => id !== selectedStepId)
                          .map(stepId => (
                            <option key={stepId} value={stepId}>
                              {triggers.find(t => t.id === steps[stepId].triggerId)?.name ||
                                'Étape non configurée'}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={!workflowName || !firstStepId}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
