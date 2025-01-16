import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotionContext } from '@/hooks/useNotion';

export interface Message {
  type: 'user' | 'bot' | 'file' | 'image';
  content: string;
  filename?: string;
  path?: string;
  timestamp: Date;
}

export type ChatMode = 'simple' | 'notion' | 'file';

interface UseChatbotProps {
  initialMode?: ChatMode;
  defaultModel?: string;
  onError?: (error: Error) => void;
}

export function useChatbot({
  initialMode = 'notion',
  defaultModel = 'codestral:latest',
  onError
}: UseChatbotProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Bonjour ! Je suis l\'assistant StoaViva. Comment puis-je vous aider ?',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getContextForQuery } = useNotionContext();

  // Charger les modèles disponibles
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch('/api/ollama/models');
        const data = await response.json();
        if (response.ok) {
          setModels(data.models || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        onError?.(error as Error);
      }
    };
    loadModels();
  }, [onError]);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{
      type: 'bot',
      content: 'Bonjour ! Je suis l\'assistant StoaViva. Comment puis-je vous aider ?',
      timestamp: new Date()
    }]);
    setInput('');
    setSelectedFile(null);
    setFileContent(null);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setInput('');
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
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
          mode,
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
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response || 'Désolé, je n\'ai pas pu générer une réponse.',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      onError?.(error as Error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, mode, selectedFile, fileContent, selectedModel, onError]);

  const changeMode = useCallback((newMode: ChatMode) => {
    setMode(newMode);
    if (newMode !== 'file') {
      setSelectedFile(null);
      setFileContent(null);
    }
  }, []);

  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    models,
    selectedModel,
    setSelectedModel,
    mode,
    changeMode,
    selectedFile,
    handleFileSelect,
    sendMessage,
    clearChat,
    messagesEndRef
  };
}
