'use client';

import { useState, useRef, useEffect } from 'react';
import { Template } from '@/lib/templates';

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

  const loadNotionTemplates = async () => {
    if (!notionDatabaseId) return;

    try {
      const response = await fetch(`/api/notion/sync?databaseId=${notionDatabaseId}`);
      const data = await response.json();
      setNotionTemplates(data);
    } catch (error) {
      console.error('Erreur lors du chargement des templates Notion:', error);
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

      await loadNotionTemplates();
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Notion:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveAsTemplate = async () => {
    if (!editingTemplate) return;

    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingTemplate,
          template: content,
          language,
        }),
      });

      await loadTemplates();
      setIsEditing(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/templates?id=${id}`, {
        method: 'DELETE',
      });
      await loadTemplates();
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInVSCode = async () => {
    try {
      const response = await fetch('/api/chat/connect/vscode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, language })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ouverture dans VSCode');
      }

      const data = await response.json();
      console.log('Ouvert dans VSCode:', data);
    } catch (error) {
      console.error('Erreur:', error instanceof Error ? error.message : String(error));
    }
  };

  const formatCode = () => {
    try {
      switch (language) {
        case 'json':
          setContent(JSON.stringify(JSON.parse(content), null, 2));
          break;
        case 'html':
          setContent(content.replace(/></g, '>\n<').split('\n').map(line => line.trim()).join('\n'));
          break;
        case 'javascript':
        case 'typescript':
          setContent(content
            .replace(/[{]/g, '{\n')
            .replace(/[}]/g, '\n}')
            .replace(/;/g, ';\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n')
          );
          break;
      }
    } catch (error) {
      console.error('Erreur de formatage:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleRun = () => {
    updatePreview(content);
  };

  const handleToolSelect = (tool: Template) => {
    setSelectedTool(tool);
    setLanguage(tool.language);
    setContent(tool.template);
  };

  const startNewTemplate = () => {
    setIsEditing(true);
    setEditingTemplate({
      id: `template-${Date.now()}`,
      name: '',
      description: '',
      language,
      template: content,
      isCustom: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            <div className="flex items-center gap-1 mr-4">
              <button
                onClick={() => setContent(content.replace(/\t/g, '  '))}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                title="Convertir les tabulations en espaces"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10H9m3-5h3m-6 0h0.01M9 12h0.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"/>
                </svg>
              </button>
              <button
                onClick={() => setContent(content.trim())}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                title="Supprimer les espaces inutiles"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <button
                onClick={formatCode}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                title="Formater le code"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm0 5h16"/>
                </svg>
              </button>
              <button
                onClick={handleRun}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                title="Exécuter"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              title="Copier"
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
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              title="Télécharger"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button
              onClick={handleOpenInVSCode}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              title="Ouvrir dans VSCode"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              title="Fermer"
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Templates</h4>
              <button
                onClick={startNewTemplate}
                className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
                    onClick={() => handleToolSelect(template)}
                    className={`w-full text-left p-2 rounded hover:bg-gray-100 transition-colors ${
                      selectedTool?.id === template.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </button>
                  {template.isCustom && (
                    <button
                      onClick={() => deleteTemplate(template.id)}
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
              {notionTemplates.length > 0 && (
                <>
                  <div className="border-t my-4"></div>
                  <h4 className="font-medium mb-2">Templates Notion</h4>
                  {notionTemplates.map((template: any) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setContent(template.content);
                        setLanguage(template.language);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
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
            <div className="flex-1 flex flex-col gap-4">
              {isEditing ? (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Nouveau template</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={editingTemplate?.name || ''}
                        onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        value={editingTemplate?.description || ''}
                        onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditingTemplate(null);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={saveAsTemplate}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 overflow-auto flex-1">
                  {language === 'html' ? (
                    <iframe
                      srcDoc={preview}
                      className="w-full h-full border-0"
                      title="Aperçu HTML"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {preview}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
