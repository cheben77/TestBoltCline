'use client';

import React from 'react';

interface ChatStyleConfigProps {
  onStyleChange: (style: ChatStyle) => void;
  onLengthChange: (length: ResponseLength) => void;
  currentStyle: ChatStyle;
}

export type ChatStyle = 'formal' | 'informal' | 'technical';
export type ResponseLength = 'concise' | 'normal' | 'detailed';

const styleDescriptions = {
  formal: {
    name: 'Formel',
    description: 'Communication professionnelle et structurée',
    examples: [
      'Je vous prie de bien vouloir...',
      'Permettez-moi de vous expliquer...',
      'Je vous remercie de votre attention.'
    ]
  },
  informal: {
    name: 'Informel',
    description: 'Communication décontractée et naturelle',
    examples: [
      'On pourrait essayer de...',
      'Voici comment faire...',
      'N\'hésite pas à me dire si...'
    ]
  },
  technical: {
    name: 'Technique',
    description: 'Communication précise et détaillée',
    examples: [
      'La procédure requiert les étapes suivantes...',
      'Les spécifications techniques indiquent...',
      'L\'analyse des paramètres montre...'
    ]
  }
};

const lengthDescriptions = {
  concise: {
    name: 'Concis',
    description: 'Réponses courtes et directes',
    wordCount: '~30 mots'
  },
  normal: {
    name: 'Normal',
    description: 'Réponses équilibrées',
    wordCount: '~100 mots'
  },
  detailed: {
    name: 'Détaillé',
    description: 'Réponses approfondies',
    wordCount: '200+ mots'
  }
};

export default function ChatStyleConfig({ onStyleChange, onLengthChange, currentStyle }: ChatStyleConfigProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Configuration du style</h3>
      
      {/* Style de communication */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Style de communication</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(styleDescriptions).map(([style, desc]) => (
            <button
              key={style}
              onClick={() => onStyleChange(style as ChatStyle)}
              className={`p-3 rounded-lg border transition-colors ${
                currentStyle === style
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="font-medium mb-1">{desc.name}</div>
              <div className="text-sm text-gray-600">{desc.description}</div>
              <div className="mt-2 text-xs">
                <div className="font-medium mb-1">Exemples :</div>
                <ul className="list-disc list-inside">
                  {desc.examples.map((example, i) => (
                    <li key={i} className="truncate">{example}</li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Longueur des réponses */}
      <div>
        <h4 className="text-sm font-medium mb-2">Longueur des réponses</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(lengthDescriptions).map(([length, desc]) => (
            <button
              key={length}
              onClick={() => onLengthChange(length as ResponseLength)}
              className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium mb-1">{desc.name}</div>
              <div className="text-sm text-gray-600">{desc.description}</div>
              <div className="mt-1 text-xs text-gray-500">{desc.wordCount}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Prévisualisation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Prévisualisation</h4>
        <div className="text-sm text-gray-600">
          {styleDescriptions[currentStyle].examples[0]}
        </div>
      </div>
    </div>
  );
}
