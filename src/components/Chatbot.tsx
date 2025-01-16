'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { FormEvent, ChangeEvent, ReactNode } from 'react';
import Canvas from './Canvas';
import FileUploadProgress from './FileUploadProgress';
import ChatConnections from './ChatConnections';
import { notionService } from '@/services/notion';
import { connectionsService } from '@/services/connections';

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

interface ModelCategory {
  id: string;
  name: string;
  description: string;
  models: string[];
  icon: ReactNode;
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
  // Catégories de modèles
  const modelCategories: ModelCategory[] = [
    {
      id: 'llm',
      name: 'Modèles de langage',
      description: 'Conversation générale et traitement du texte',
      models: ['llama3.1:8b', 'qwen2.5:14b', 'codellama:13b'],
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      )
    },
    {
      id: 'data',
      name: 'Analyse de données',
      description: 'Analyse et compréhension des données structurées',
      models: ['codestral:latest', 'codellama:13b'],
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z"/>
        </svg>
      )
    },
    {
      id: 'vision',
      name: 'Vision par ordinateur',
      description: 'Analyse et compréhension des images',
      models: ['llava:13b', 'llama3.2-vision:11b'],
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9-4c0-1.11-.89-2-2-2h-1V5c0-1.11-.89-2-2-2H8c-1.11 0-2 .89-2 2v2H5c-1.11 0-2 .89-2 2v9c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-9zm-2 0v9H5v-9h14z"/>
        </svg>
      )
    },
  ];

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
          action: () => {
            setMode('simple');
            setInput('');
          }
        },
        {
          id: 'file',
          name: 'Analyser Fichier',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
          ),
          description: 'Analyser des fichiers (texte, image, audio)',
          action: () => {
            setMode('file');
            setInput('');
          }
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
  const [connections, setConnections] = useState([
    { name: 'Notion', isConnected: false, isLoading: false, onClick: () => handleConnect('notion') },
    { name: 'Steam', isConnected: false, isLoading: false, onClick: () => handleConnect('steam') },
    { name: 'Google Drive', isConnected: false, isLoading: false, onClick: () => handleConnect('google-drive') },
    { name: 'Google', isConnected: false, isLoading: false, onClick: () => handleConnect('google') },
    { name: 'YouTube', isConnected: false, isLoading: false, onClick: () => handleConnect('youtube') }
  ]);
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
  const [selectedModel, setSelectedModel] = useState('llama3.1:8b');
  const [selectedCategory, setSelectedCategory] = useState('llm');
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ filename: string; progress: number } | null>(null);
  const [mode, setMode] = useState<'simple' | 'notion' | 'file'>('notion');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleConnect = async (service: string) => {
    // Mettre à jour l'état de chargement
    setConnections(prev => prev.map(conn => 
      conn.name.toLowerCase() === service.toLowerCase()
        ? { ...conn, isLoading: true }
        : conn
    ));

    try {
      const response = await connectionsService.connect(service);
      
      // Mettre à jour l'état des connexions
      setConnections(prev => prev.map(conn => 
        conn.name.toLowerCase() === service.toLowerCase()
          ? { 
              ...conn, 
              isConnected: response.status === 'connected',
              isLoading: false
            }
          : conn
      ));

      // Mettre à jour le statut de Notion si nécessaire
      if (service.toLowerCase() === 'notion') {
        setNotionStatus(response.status);
      }

      // Ajouter un message de confirmation
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: `${response.status === 'connected' ? 'Connexion établie' : 'Déconnexion effectuée'} avec ${service}`
        }
      ]);
    } catch (error) {
      console.error(`Erreur lors de la connexion à ${service}:`, error);
      
      // Réinitialiser l'état de chargement
      setConnections(prev => prev.map(conn => 
        conn.name.toLowerCase() === service.toLowerCase()
          ? { ...conn, isLoading: false }
          : conn
      ));

      // Ajouter un message d'erreur
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: `Erreur lors de la connexion à ${service}. Veuillez réessayer.`
        }
      ]);
    }
  };

  useEffect(() => {
    const checkStatuses = async () => {
      try {
        // Récupérer la liste des services à vérifier
        const serviceNames = connections.map(conn => conn.name);
        const statuses = await connectionsService.checkAllStatuses(serviceNames);
        
        // Mettre à jour l'état des connexions
        setConnections(prev => prev.map(conn => ({
          ...conn,
          isConnected: statuses[conn.name]?.status === 'connected'
        })));

        // Mettre à jour le statut de Notion
        const notionStatus = statuses['Notion'];
        if (notionStatus) {
          setNotionStatus(notionStatus.status);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des statuts:', error);
      }
    };

    // Vérifier les statuts au chargement
    checkStatuses();

    // Vérifier les statuts toutes les 5 minutes au lieu de toutes les 30 secondes
    const statusInterval = setInterval(checkStatuses, 5 * 60 * 1000);

    return () => clearInterval(statusInterval);
  }, []); // Supprimer la dépendance connections pour éviter les vérifications trop fréquentes

  // Charger les modèles et ajuster la catégorie en fonction du contexte
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch('/api/ollama/models');
        const data = await response.json();
        if (response.ok) {
          setModels(data.models || []);
          
          let newCategory = selectedCategory;
          let message = '';

          // Sélectionner la catégorie appropriée en fonction du contexte
          if (mode === 'file') {
            const fileType = selectedFile?.type || '';
            if (fileType.startsWith('image/')) {
              newCategory = 'vision';
              message = 'Passage en mode analyse d\'image avec le modèle LLaVA';
            } else if (fileType.startsWith('audio/')) {
              newCategory = 'audio';
              message = 'Passage en mode traitement audio avec le modèle Whisper';
            } else {
              newCategory = 'llm';
              message = 'Passage en mode analyse de texte';
            }
          } else if (mode === 'notion') {
            newCategory = 'data';
            message = 'Passage en mode analyse de données structurées';
          } else {
            newCategory = 'llm';
            message = 'Passage en mode conversation générale';
          }

          // Si la catégorie a changé
          if (newCategory !== selectedCategory) {
            setSelectedCategory(newCategory);
            
            // Sélectionner le meilleur modèle disponible dans la nouvelle catégorie
            const category = modelCategories.find(cat => cat.id === newCategory);
            if (category) {
              const availableModels = category.models.filter(model => data.models?.includes(model));
              if (availableModels.length > 0) {
                const newModel = availableModels[0];
                if (newModel !== selectedModel) {
                  setSelectedModel(newModel);
                  // Ajouter un message explicatif pour l'utilisateur
                  setMessages(prev => [
                    ...prev,
                    {
                      type: 'bot',
                      content: message
                    }
                  ]);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des modèles:', error);
      }
    };
    loadModels();
  }, [mode, selectedFile, selectedCategory, selectedModel, modelCategories]);

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
          <ChatConnections connections={connections} />
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
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    {modelCategories.find(cat => cat.id === selectedCategory)?.icon}
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        setSelectedCategory(newCategory);
                        // Sélectionner le premier modèle disponible de la catégorie
                        const category = modelCategories.find(cat => cat.id === newCategory);
                        if (category) {
                          const availableModels = category.models.filter(model => models.includes(model));
                          if (availableModels.length > 0) {
                            setSelectedModel(availableModels[0]);
                          }
                        }
                      }}
                      className="border-none bg-transparent text-gray-800 pr-8"
                    >
                      {modelCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="p-2 border rounded-lg bg-gray-50 text-gray-800"
                  >
                    {modelCategories
                      .find(cat => cat.id === selectedCategory)
                      ?.models.filter(model => models.includes(model))
                      .map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="text-xs text-gray-600">
                  {modelCategories.find(cat => cat.id === selectedCategory)?.description}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${
                    mode === 'file' 
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : mode === 'notion'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-gray-50 text-gray-800 border border-gray-200'
                  }`}>
                    {mode === 'file' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                      </svg>
                    ) : mode === 'notion' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4v16h16V4H4zm14 14H6V6h12v12z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                    )}
                    <select
                      value={mode}
                      onChange={(e) => {
                        const newMode = e.target.value as 'simple' | 'notion' | 'file';
                        setMode(newMode);
                        if (newMode !== 'file') {
                          setSelectedFile(null);
                          setFileContent(null);
                        }
                        // Ajouter un message explicatif
                        setMessages(prev => [
                          ...prev,
                          {
                            type: 'bot',
                            content: newMode === 'file'
                              ? "Mode fichier activé. Vous pouvez maintenant analyser des fichiers texte, image ou audio."
                              : newMode === 'notion'
                                ? "Mode Notion activé. Accès aux données de votre base Notion."
                                : "Mode conversation générale activé."
                          }
                        ]);
                      }}
                      className="bg-transparent border-none focus:ring-0 text-current"
                    >
                      <option value="simple">Mode Simple</option>
                      <option value="notion">Mode Notion</option>
                      <option value="file">Mode Fichier</option>
                    </select>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    mode === 'file'
                      ? 'bg-blue-100 text-blue-800'
                      : mode === 'notion'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {modelCategories.find(cat => cat.id === selectedCategory)?.name}
                  </div>
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="font-medium">Capacités actuelles:</span>
                  {mode === 'file' 
                    ? "Analyse de fichiers texte, image et audio" 
                    : mode === 'notion' 
                      ? "Accès et analyse des données Notion"
                      : "Conversation générale et assistance"}
                </div>
              </div>

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
                          if (file.type.startsWith('image/')) {
                            // Pour les images, lire en base64
                            setFileContent(e.target?.result as string);
                          } else {
                            // Pour les autres fichiers, lire comme texte
                            setFileContent(e.target?.result as string);
                          }
                        };
                        if (file.type.startsWith('image/')) {
                          reader.readAsDataURL(file);
                        } else {
                          reader.readAsText(file);
                        }
                      }
                    }}
                    className="p-2 border rounded-lg text-gray-800 w-full"
                    accept=".txt,.md,.json,.csv,.jpg,.jpeg,.png,.gif,.mp3,.wav"
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
