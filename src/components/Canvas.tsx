'use client';

import { useState, useRef, useEffect } from 'react';
import { Template } from '@/lib/templates';
import { Workflow, TRIGGERS, Trigger } from '@/lib/triggers';
import WorkflowBuilder from './WorkflowBuilder';

interface CanvasProps {
  onClose: () => void;
  initialContent?: string;
}

export default function Canvas({ onClose, initialContent = '' }: CanvasProps) {
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState('text');
  const [preview, setPreview] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTool, setSelectedTool] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [notionTemplates, setNotionTemplates] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isWorkflowMode, setIsWorkflowMode] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [triggerParams, setTriggerParams] = useState<Record<string, any>>({});
  const [triggerResult, setTriggerResult] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
    updatePreview(content);
  }, [content]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
    }
  };

  const updatePreview = (code: string) => {
    try {
      switch (language) {
        case 'html':
          setPreview(code);
          break;
        case 'javascript':
        case 'typescript':
          try {
            const result = new Function(`return ${code}`)();
            setPreview(JSON.stringify(result, null, 2));
          } catch (error) {
            setPreview(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          break;
        case 'json':
          const parsed = JSON.parse(code);
          setPreview(JSON.stringify(parsed, null, 2));
          break;
        case 'markdown':
          setPreview(code);
          break;
        default:
          setPreview(code);
      }
    } catch (error) {
      setPreview(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const syncToNotion = async () => {
    if (!notionDatabaseId) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseId: notionDatabaseId,
          content,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation');
      }

      const data = await response.json();
      setNotionTemplates(data);
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Notion:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const executeWorkflow = async (workflow: Workflow) => {
    setIsExecuting(true);
    try {
      const response = await fetch('/api/triggers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflow }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'exécution du workflow');
      }

      const { results } = await response.json();
      setContent(prev => prev + '\n' + results.join('\n'));
    } catch (error) {
      console.error('Erreur lors de l\'exécution du workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTriggerSelect = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setTriggerParams({});
  };

  const handleParamChange = (paramId: string, value: any) => {
    setTriggerParams(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const executeTrigger = async () => {
    if (!selectedTrigger) return;

    try {
      const result = await selectedTrigger.execute(triggerParams);
      setTriggerResult(result);
      setContent(prev => prev + '\n' + result);
    } catch (error) {
      setTriggerResult(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow]);
    setIsWorkflowMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isWorkflowMode ? (
        <WorkflowBuilder
          onSave={handleSaveWorkflow}
          onCancel={() => setIsWorkflowMode(false)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[95vh] flex flex-col">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Canevas de génération</h3>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-green-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value="text">Text</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={notionDatabaseId}
                  onChange={(e) => setNotionDatabaseId(e.target.value)}
                  placeholder="ID Base Notion"
                  className="px-2 py-1 text-sm bg-green-700 text-white rounded placeholder-green-300"
                />
                <button
                  onClick={syncToNotion}
                  disabled={!notionDatabaseId || isSyncing}
                  className="px-3 py-1 text-sm bg-green-700 hover:bg-green-800 rounded disabled:opacity-50"
                >
                  {isSyncing ? 'Synchronisation...' : 'Sync Notion'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWorkflowMode(true)}
                className="px-3 py-1 text-sm bg-green-700 hover:bg-green-800 rounded"
              >
                Créer Workflow
              </button>
              {workflows.length > 0 && (
                <select
                  value={selectedWorkflow?.id || ''}
                  onChange={(e) => {
                    const workflow = workflows.find(w => w.id === e.target.value);
                    setSelectedWorkflow(workflow || null);
                  }}
                  className="bg-green-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="">Sélectionner un workflow</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>
              )}
              {selectedWorkflow && (
                <button
                  onClick={() => executeWorkflow(selectedWorkflow)}
                  disabled={isExecuting}
                  className="px-3 py-1 text-sm bg-green-700 hover:bg-green-800 rounded disabled:opacity-50"
                >
                  {isExecuting ? 'Exécution...' : 'Exécuter'}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 flex gap-4">
            <div className="w-64 border-r pr-4">
              <div className="mb-4">
                <h4 className="font-medium mb-2">Triggers Natifs</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {TRIGGERS.map(trigger => (
                    <button
                      key={trigger.id}
                      onClick={() => handleTriggerSelect(trigger)}
                      className={`w-full text-left p-2 rounded hover:bg-gray-100 transition-colors ${
                        selectedTrigger?.id === trigger.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="font-medium text-sm">{trigger.name}</div>
                      <div className="text-xs text-gray-500">{trigger.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Templates</h4>
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingTemplate({
                        id: `template-${Date.now()}`,
                        name: '',
                        description: '',
                        language,
                        template: content,
                        isCustom: true,
                      });
                    }}
                    className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Nouveau
                  </button>
                </div>
                <div className="space-y-2">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className="relative group"
                    >
                      <button
                        onClick={() => {
                          setSelectedTool(template);
                          setLanguage(template.language);
                          setContent(template.template);
                        }}
                        className={`w-full text-left p-2 rounded hover:bg-gray-100 transition-colors ${
                          selectedTool?.id === template.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </button>
                      {template.isCustom && (
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`/api/templates?id=${template.id}`, {
                                method: 'DELETE',
                              });
                              await loadTemplates();
                            } catch (error) {
                              console.error('Erreur lors de la suppression:', error);
                            }
                          }}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 flex gap-4">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-mono resize-none text-gray-900"
                    placeholder="Le contenu généré apparaîtra ici..."
                  />
                </div>
                <div className="w-80 flex flex-col gap-4">
                  {selectedTrigger ? (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-4">{selectedTrigger.name}</h4>
                      <div className="space-y-4">
                        {selectedTrigger.params.map(param => (
                          <div key={param.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {param.name}
                            </label>
                            {param.type === 'select' ? (
                              <select
                                value={triggerParams[param.id] || ''}
                                onChange={(e) => handleParamChange(param.id, e.target.value)}
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
                                value={triggerParams[param.id] || ''}
                                onChange={(e) => handleParamChange(param.id, Number(e.target.value))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                              />
                            ) : (
                              <input
                                type="text"
                                value={triggerParams[param.id] || ''}
                                onChange={(e) => handleParamChange(param.id, e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                              />
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {param.description}
                            </p>
                          </div>
                        ))}
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            onClick={() => setSelectedTrigger(null)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={executeTrigger}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Exécuter
                          </button>
                        </div>
                        {triggerResult && (
                          <div className="mt-4 p-2 bg-gray-50 rounded text-sm">
                            {triggerResult}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center text-gray-500">
                      Sélectionnez un trigger pour commencer
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
