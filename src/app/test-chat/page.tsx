'use client';

import { useState, useEffect } from 'react';
import Canvas from '@/components/Canvas';
import { ConnectionStatus } from '@/features/chatbot/components/ConnectionStatus';
import { ChatError } from '@/features/chatbot/components/ChatError';
import { useChatError } from '@/features/chatbot/hooks/useChatError';

export default function TestChat() {
  const { handleError, clearError, error } = useChatError();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.1:8b');
  const [mode, setMode] = useState<'simple' | 'notion' | 'file'>('notion');
  const [models, setModels] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    // Charger la liste des modèles disponibles
    fetch('/api/ollama/models')
      .then(res => res.json())
      .then(data => setModels(data.models || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    if (mode === 'file' && !selectedFile) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Veuillez sélectionner un fichier avant de poser une question en mode fichier.' 
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

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

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Erreur: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      handleError(new Error('Une erreur est survenue lors de la communication avec le serveur'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Test du Chat StoaViva</h1>
        <ConnectionStatus />
        {error && (
          <ChatError 
            message={error.message} 
            onRetry={() => {
              clearError();
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }} 
          />
        )}
        <p className="mb-4 text-gray-600">
          Ce chat utilise Notion pour accéder aux informations sur les produits et services,
          et Ollama pour générer des réponses contextuelles.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block bg-white border border-gray-200 text-gray-800 p-3 rounded-lg">
                En train de réfléchir...
              </div>
            </div>
          )}
        </div>

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
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Envoyer
          </button>
          <button
            type="button"
            onClick={() => {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage?.role === 'assistant') {
                setCanvasContent(lastMessage.content);
                setShowCanvas(true);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            disabled={!messages.length || messages[messages.length - 1]?.role !== 'assistant'}
          >
            Ouvrir dans le canevas
          </button>
        </form>

        {showCanvas && (
          <Canvas
            initialContent={canvasContent}
            onClose={() => setShowCanvas(false)}
          />
        )}

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
  );
}
