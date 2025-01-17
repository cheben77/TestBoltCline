'use client';

import { useState } from 'react';
import { Workflow, TRIGGERS, Trigger, TriggerParam } from '@/lib/triggers';

interface WorkflowBuilderProps {
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

interface WorkflowStep {
  id: string;
  triggerId: string;
  params: Record<string, any>;
  next?: string;
}

export default function WorkflowBuilder({ onSave, onCancel }: WorkflowBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Record<string, WorkflowStep>>({});
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [firstStepId, setFirstStepId] = useState<string | null>(null);

  const addStep = () => {
    const stepId = `step-${Date.now()}`;
    setSteps(prev => ({
      ...prev,
      [stepId]: {
        id: stepId,
        triggerId: '',
        params: {},
      }
    }));
    if (!firstStepId) {
      setFirstStepId(stepId);
    }
    setSelectedStepId(stepId);
  };

  const removeStep = (stepId: string) => {
    setSteps(prev => {
      const newSteps = { ...prev };
      delete newSteps[stepId];

      // Mettre à jour les références next
      Object.values(newSteps).forEach(step => {
        if (step.next === stepId) {
          step.next = prev[stepId]?.next;
        }
      });

      // Mettre à jour firstStepId si nécessaire
      if (firstStepId === stepId) {
        const remainingSteps = Object.keys(newSteps);
        setFirstStepId(remainingSteps.length > 0 ? remainingSteps[0] : null);
      }

      return newSteps;
    });
    if (selectedStepId === stepId) {
      setSelectedStepId(null);
    }
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

  const handleSave = () => {
    if (!name || !firstStepId) return;

    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      steps,
      firstStepId,
    };

    onSave(workflow);
  };

  const renderStepNode = (stepId: string) => {
    const step = steps[stepId];
    const trigger = TRIGGERS.find(t => t.id === step.triggerId);

    return (
      <div
        key={stepId}
        className={`p-4 border rounded-lg mb-4 cursor-pointer ${
          selectedStepId === stepId ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
        onClick={() => setSelectedStepId(stepId)}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">
            {trigger ? trigger.name : 'Nouveau trigger'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newStepId = `step-${Date.now()}`;
                setSteps(prev => ({
                  ...prev,
                  [stepId]: {
                    ...prev[stepId],
                    next: newStepId,
                  },
                  [newStepId]: {
                    id: newStepId,
                    triggerId: '',
                    params: {},
                    next: prev[stepId].next,
                  },
                }));
                setSelectedStepId(newStepId);
              }}
              className="p-1 text-green-600 hover:text-green-800"
              title="Ajouter une étape après"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeStep(stepId);
              }}
              className="p-1 text-red-600 hover:text-red-800"
              title="Supprimer l'étape"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {step.next && (
          <div className="mt-2 border-l-2 border-green-500 pl-4">
            {renderStepNode(step.next)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[95vh] flex flex-col">
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-semibold">Créer un workflow</h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-green-700 hover:bg-green-800 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !firstStepId}
            className="px-3 py-1 text-sm bg-green-700 hover:bg-green-800 rounded disabled:opacity-50"
          >
            Sauvegarder
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 flex gap-4">
        <div className="w-1/3 border-r pr-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du workflow
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Mon workflow"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Description du workflow"
              rows={3}
            />
          </div>
          <div>
            <button
              onClick={addStep}
              className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter une étape
            </button>
          </div>
          <div className="mt-4">
            {firstStepId && renderStepNode(firstStepId)}
          </div>
        </div>
        <div className="flex-1">
          {selectedStepId ? (
            <div>
              <h4 className="font-medium mb-4">Configuration de l'étape</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger
                  </label>
                  <select
                    value={steps[selectedStepId].triggerId}
                    onChange={(e) => {
                      updateStep(selectedStepId, {
                        triggerId: e.target.value,
                        params: {},
                      });
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  >
                    <option value="">Sélectionner un trigger</option>
                    {TRIGGERS.map(trigger => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </select>
                </div>
                {steps[selectedStepId].triggerId && (
                  <div className="space-y-4">
                    {TRIGGERS.find(t => t.id === steps[selectedStepId].triggerId)?.params.map(param => (
                      <div key={param.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name}
                        </label>
                        {param.type === 'select' ? (
                          <select
                            value={steps[selectedStepId].params[param.id] || ''}
                            onChange={(e) => {
                              updateStep(selectedStepId, {
                                params: {
                                  ...steps[selectedStepId].params,
                                  [param.id]: e.target.value,
                                },
                              });
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          >
                            <option value="">Sélectionner...</option>
                            {param.options?.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : param.type === 'number' ? (
                          <input
                            type="number"
                            value={steps[selectedStepId].params[param.id] || ''}
                            onChange={(e) => {
                              updateStep(selectedStepId, {
                                params: {
                                  ...steps[selectedStepId].params,
                                  [param.id]: Number(e.target.value),
                                },
                              });
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            value={steps[selectedStepId].params[param.id] || ''}
                            onChange={(e) => {
                              updateStep(selectedStepId, {
                                params: {
                                  ...steps[selectedStepId].params,
                                  [param.id]: e.target.value,
                                },
                              });
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Sélectionnez une étape pour la configurer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
