'use client';

import React, { useState } from 'react';
import Canvas from '../../components/Canvas';
import { Workflow } from '../../lib/triggers';

export default function WorkflowPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedWorkflow, setSavedWorkflow] = useState<Workflow | null>(null);

  const handleSave = async (workflow: Workflow) => {
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save workflow');
      }

      const savedData = await response.json();
      setSavedWorkflow(savedData);

      // Show success notification
      const notification = document.getElementById('notification');
      if (notification) {
        notification.textContent = 'Workflow sauvegardé avec succès';
        notification.className = 'notification success';
        setTimeout(() => {
          notification.className = 'notification hidden';
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Éditeur de Workflow
          </h1>
          <p className="mt-2 text-gray-600">
            Créez et modifiez vos workflows d'automatisation
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
          {/* Notification */}
          <div id="notification" className="notification hidden" role="alert" />

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="relative h-full">
            {isSaving && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            )}
            <Canvas
              onSave={handleSave}
              initialWorkflow={savedWorkflow}
            />
          </div>
        </div>

        {/* Help section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Guide d'utilisation
          </h2>
          <div className="prose prose-blue">
            <ul className="space-y-2">
              <li>Cliquez sur "Créer un workflow" pour commencer</li>
              <li>Ajoutez des étapes en utilisant les triggers disponibles</li>
              <li>Configurez les paramètres de chaque étape</li>
              <li>Cliquez sur "Sauvegarder" pour enregistrer votre workflow</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 1rem;
          border-radius: 0.375rem;
          z-index: 50;
          transition: all 0.3s ease;
        }

        .notification.success {
          background-color: #34D399;
          color: white;
        }

        .notification.hidden {
          opacity: 0;
          transform: translateY(-100%);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
