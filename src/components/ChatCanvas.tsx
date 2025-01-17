import React, { useState, useEffect } from 'react';
import { Workflow, WorkflowStep, Trigger, TRIGGERS } from '@/lib/triggers';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import './ChatCanvas.css';

interface Props {
  onClose: () => void;
  initialContent: string;
}

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  description: string;
}

interface AutomationStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  config: Record<string, any>;
  nextSteps: string[];
}

const ChatCanvas: React.FC<Props> = ({ onClose, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isEditing, setIsEditing] = useState(false);

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'bash', name: 'Bash' }
  ];

  const automationTools = [
    { id: 'code-extractor', name: 'Extraire le code', icon: '📄' },
    { id: 'automation-creator', name: 'Créer une automatisation', icon: '⚡' },
    { id: 'code-generator', name: 'Générer du code', icon: '💻' },
    { id: 'workflow-builder', name: 'Créer un workflow', icon: '🔄' }
  ];

  useEffect(() => {
    // Extraire automatiquement les blocs de code du contenu initial
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: CodeBlock[] = [];
    let match;
    
    while ((match = codeRegex.exec(content)) !== null) {
      blocks.push({
        id: Math.random().toString(36).substring(7),
        language: match[1] || 'text',
        code: match[2].trim(),
        description: ''
      });
    }
    
    setCodeBlocks(blocks);
  }, [content]);

  const handleExtractCode = () => {
    const newBlock: CodeBlock = {
      id: Math.random().toString(36).substring(7),
      language: selectedLanguage,
      code: content,
      description: 'Code extrait du message'
    };
    setCodeBlocks([...codeBlocks, newBlock]);
  };

  const handleCreateAutomation = () => {
    const newStep: AutomationStep = {
      id: Math.random().toString(36).substring(7),
      type: 'trigger',
      config: {},
      nextSteps: []
    };
    setAutomationSteps([...automationSteps, newStep]);
  };

  const handleGenerateCode = () => {
    // Générer du code basé sur les étapes d'automatisation
    const generatedCode = automationSteps.map(step => {
      switch (step.type) {
        case 'trigger':
          return `// Trigger: ${step.id}\nconst trigger = new Trigger(${JSON.stringify(step.config)});`;
        case 'action':
          return `// Action: ${step.id}\nawait performAction(${JSON.stringify(step.config)});`;
        case 'condition':
          return `// Condition: ${step.id}\nif (checkCondition(${JSON.stringify(step.config)})) {`;
        default:
          return '';
      }
    }).join('\n\n');

    const newBlock: CodeBlock = {
      id: Math.random().toString(36).substring(7),
      language: selectedLanguage,
      code: generatedCode,
      description: 'Code généré à partir des étapes d\'automatisation'
    };
    setCodeBlocks([...codeBlocks, newBlock]);
  };

  const handleCreateWorkflow = async () => {
    const workflow: Workflow = {
      id: Math.random().toString(36).substring(7),
      name: 'Nouveau workflow',
      description: 'Workflow créé depuis le canevas',
      firstStepId: '',
      steps: {},
      triggers: [],
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du workflow');
      }

      const savedWorkflow = await response.json();
      console.log('Workflow créé:', savedWorkflow);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="chat-canvas">
      <div className="chat-canvas-container">
        <div className="chat-canvas-header">
          <h2 className="chat-canvas-title">Canevas d'Automatisation</h2>
          <div className="chat-canvas-tools">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="chat-canvas-language"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {automationTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    switch (tool.id) {
                      case 'code-extractor':
                        handleExtractCode();
                        break;
                      case 'automation-creator':
                        handleCreateAutomation();
                        break;
                      case 'code-generator':
                        handleGenerateCode();
                        break;
                      case 'workflow-builder':
                        handleCreateWorkflow();
                        break;
                    }
                  }}
                  className="chat-canvas-tool-button"
                  title={tool.name}
                >
                  <span>{tool.icon}</span>
                  <span className="hidden md:inline">{tool.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="chat-canvas-content">
          {/* Panneau de gauche : Message original */}
          <div className="chat-canvas-panel">
            <h3 className="chat-canvas-panel-title">Message Original</h3>
            <div className="chat-canvas-message">
              {content}
            </div>
          </div>

          {/* Panneau central : Blocs de code */}
          <div className="chat-canvas-panel">
            <h3 className="chat-canvas-panel-title">Blocs de Code</h3>
            {codeBlocks.map(block => (
              <div key={block.id} className="chat-canvas-code-block">
                <div className="chat-canvas-code-header">
                  <span className="chat-canvas-code-language">{block.language}</span>
                  <button
                    onClick={() => {
                      const updatedBlocks = codeBlocks.filter(b => b.id !== block.id);
                      setCodeBlocks(updatedBlocks);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <pre className="chat-canvas-code-content">
                  <code>{block.code}</code>
                </pre>
                <input
                  type="text"
                  value={block.description}
                  onChange={(e) => {
                    const updatedBlocks = codeBlocks.map(b =>
                      b.id === block.id ? { ...b, description: e.target.value } : b
                    );
                    setCodeBlocks(updatedBlocks);
                  }}
                  placeholder="Description du code"
                  className="chat-canvas-code-description"
                />
              </div>
            ))}
          </div>

          {/* Panneau de droite : Étapes d'automatisation */}
          <div className="chat-canvas-panel">
            <h3 className="chat-canvas-panel-title">Automatisation</h3>
            {automationSteps.map(step => (
              <div key={step.id} className="chat-canvas-automation">
                <div className="chat-canvas-automation-header">
                  <select
                    value={step.type}
                    onChange={(e) => {
                      const updatedSteps = automationSteps.map(s =>
                        s.id === step.id ? { ...s, type: e.target.value as 'trigger' | 'action' | 'condition' } : s
                      );
                      setAutomationSteps(updatedSteps);
                    }}
                    className="chat-canvas-automation-type"
                  >
                    <option value="trigger">Déclencheur</option>
                    <option value="action">Action</option>
                    <option value="condition">Condition</option>
                  </select>
                  <button
                    onClick={() => {
                      const updatedSteps = automationSteps.filter(s => s.id !== step.id);
                      setAutomationSteps(updatedSteps);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2">
                  <textarea
                    value={JSON.stringify(step.config, null, 2)}
                    onChange={(e) => {
                      try {
                        const config = JSON.parse(e.target.value);
                        const updatedSteps = automationSteps.map(s =>
                          s.id === step.id ? { ...s, config } : s
                        );
                        setAutomationSteps(updatedSteps);
                      } catch (error) {
                        // Ignorer les erreurs de parsing JSON
                      }
                    }}
                    placeholder="Configuration (JSON)"
                    className="chat-canvas-automation-config"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-canvas-footer">
          <button
            onClick={onClose}
            className="chat-canvas-button chat-canvas-button-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleCreateWorkflow}
            className="chat-canvas-button chat-canvas-button-primary"
          >
            Créer le Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatCanvas;
