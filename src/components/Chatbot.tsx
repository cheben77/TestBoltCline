'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { FormEvent, ChangeEvent, ReactNode } from 'react';
import Canvas from './Canvas';
import FileUploadProgress from './FileUploadProgress';
import { notionService } from '@/services/notion';

// Types
interface ChatToolCategory {
  id: string;
  name: string;
  enabled: boolean;
  tools: ChatTool[];
}

interface ChatTool {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  action: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  ecological_impact: string;
  benefits: string;
  usage_instructions: string;
  ingredients: string[];
  certifications: string[];
}

interface Service {
  id: string;
  name: string;
  type: string;
  duration: number;
  capacity: number;
  location: string;
  description: string;
  benefits: string;
  price: number;
  instructor: string;
  schedule: string;
  prerequisites: string[];
}

interface NotionContext {
  products: Product[];
  services: Service[];
  query: string;
}

interface Message {
  type: 'user' | 'bot' | 'file' | 'image';
  content: string;
  filename?: string;
  path?: string;
}

interface CanvasProps {
  onClose: () => void;
  initialContent: string;
}


// Components
const ChatToolbox: React.FC<{
  onToolSelect: (tool: ChatTool) => void;
  activeMode: string;
  setMode: (mode: 'simple' | 'notion' | 'file') => void;
  setInput: (input: string) => void;
  categories: ChatToolCategory[];
}> = ({ onToolSelect, activeMode, setMode, setInput, categories }) => {
  return (
    <div className="flex flex-col gap-4">
      {categories.map((category: ChatToolCategory) => (
        <div key={category.id} className="bg-green-700 p-2 rounded-lg">
          <h4 className="text-sm font-medium mb-2 px-2">{category.name}</h4>
          <div className="flex flex-wrap gap-2">
            {category.tools.map((tool: ChatTool) => (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  tool.id === activeMode ? 'bg-green-600' : 'hover:bg-green-600'
                }`}
                title={tool.name}
              >
                {tool.icon}
                <span className="text-sm">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Chatbot(): React.ReactElement {
  // Data
  const categories: ChatToolCategory[] = [
    {
      id: 'native',
      name: 'Outils Natifs',
      enabled: true,
      tools: [
        {
          id: 'chat',
          name: 'Chat Simple',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          description: 'Chat général sans contexte spécifique',
          action: () => {}
        },
        {
          id: 'database',
          name: 'Personnaliser Base de Données',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm0 5h16M8 12v5m4-5v5m4-5v5" />
            </svg>
          ),
          description: 'Personnaliser les bases de données avec Ollama',
          action: () => {
            setMode('notion');
            setInput('Aide-moi à personnaliser ma base de données en utilisant le modèle Ollama. Voici ce que je veux faire : ');
          }
        }
      ]
    }
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [notionStatus, setNotionStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Bonjour ! Je suis l\'assistant StoaViva. Comment puis-je vous aider ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('codestral:latest');
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ filename: string; progress: number } | null>(null);
  const [mode, setMode] = useState<'simple' | 'notion' | 'file'>('notion');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/notion/status');
        const data = await response.json();
        setNotionStatus(data.status);
      } catch (error) {
        console.error('Erreur lors de la vérification du statut Notion:', error);
        setNotionStatus('disconnected');
      }
    };

    const statusInterval = setInterval(checkStatus, 30000);
    checkStatus();

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch('/api/ollama/models');
        const data = await response.json();
        if (response.ok) {
          setModels(data.models || []);
          // Si codestral:latest est disponible, l'utiliser par défaut
          if (data.models?.includes('codestral:latest')) {
            setSelectedModel('codestral:latest');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des modèles:', error);
      }
    };
    loadModels();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          model: selectedModel,
          mode: mode,
          context: mode === 'file' ? {
            filename: selectedFile?.name,
            content: fileContent,
            type: selectedFile?.type
          } : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: `Erreur: ${data.error}` }
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: data.response || 'Désolé, je n\'ai pas pu générer une réponse.' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all z-50 ${
          isOpen ? 'rotate-45' : ''
        }`}
        title="Assistant StoaViva"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[95vw] md:w-[800px] lg:w-[1000px] h-[90vh] bg-white rounded-lg shadow-xl flex flex-col z-40">
          <ChatToolbox
            onToolSelect={(tool) => tool.action()}
            activeMode={mode}
            setMode={setMode}
            setInput={setInput}
            categories={categories}
          />
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.type === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-100 rounded-lg">
                  Chargement...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="mb-4 flex flex-wrap gap-4">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="p-2 border rounded-lg text-gray-800"
              >
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>

              <select
                value={mode}
                onChange={(e) => {
                  const newMode = e.target.value as 'simple' | 'notion' | 'file';
                  setMode(newMode);
                  if (newMode !== 'file') {
                    setSelectedFile(null);
                    setFileContent(null);
                  }
                }}
                className="p-2 border rounded-lg text-gray-800"
              >
                <option value="simple">Mode Simple</option>
                <option value="notion">Mode Notion</option>
                <option value="file">Mode Fichier</option>
              </select>

              {mode === 'file' && (
                <div className="w-full">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFileContent(e.target?.result as string);
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="p-2 border rounded-lg text-gray-800 w-full"
                    accept=".txt,.md,.json,.csv"
                  />
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      Fichier sélectionné : {selectedFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'file' ? 
                  "Posez une question sur le contenu du fichier..." : 
                  "Posez une question sur nos produits et services..."}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (mode === 'file' && !selectedFile)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Envoyer
              </button>
              <button
                type="button"
                onClick={() => {
                  const lastMessage = messages[messages.length - 1];
                  if (lastMessage?.type === 'bot') {
                    setCanvasContent(lastMessage.content);
                    setShowCanvas(true);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={!messages.length || messages[messages.length - 1]?.type !== 'bot'}
              >
                Ouvrir dans le canevas
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-500">
              <p>Exemples de questions :</p>
              <ul className="list-disc list-inside">
                {mode === 'file' ? (
                  <>
                    <li>Que contient ce fichier ?</li>
                    <li>Peux-tu résumer le contenu ?</li>
                    <li>Quels sont les points principaux ?</li>
                  </>
                ) : (
                  <>
                    <li>Quels sont vos produits de bien-être ?</li>
                    <li>Avez-vous des services pour la relaxation ?</li>
                    <li>Je cherche des produits écologiques pour le quotidien</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showCanvas && (
        <Canvas
          onClose={() => setShowCanvas(false)}
          initialContent={canvasContent}
        />
      )}
    </>
  );
}
