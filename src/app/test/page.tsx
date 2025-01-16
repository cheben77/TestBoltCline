'use client';

import { useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testOllama = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Quels sont vos produits de bien-être ?',
        }),
      });
      
      const data = await res.json();
      if (data.error) {
        setResponse(`Erreur: ${data.error}`);
      } else {
        setResponse(data.response);
      }
    } catch (error) {
      setResponse(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Ollama Integration</h1>
      <button
        onClick={testOllama}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Chargement...' : 'Tester'}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}
