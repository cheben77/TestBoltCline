'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { notionService } from '@/services/notion';
import { ollamaService } from '@/services/ollama';

// Import dynamique pour éviter les erreurs SSR
const EcoImpactChart = dynamic(() => import('@/components/EcoImpactChart'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  ),
});

export default function ImpactEcologique() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      const ecoData = await notionService.getEcologicalImpact();
      
      // Créer un prompt pour Ollama avec les données
      const prompt = `En tant qu'expert en développement durable, analyse ces données d'impact écologique :
${JSON.stringify(ecoData, null, 2)}

Fournis une analyse détaillée qui inclut :
1. Les points forts de notre démarche écologique
2. Les domaines nécessitant des améliorations
3. Des recommandations concrètes
4. Une projection des tendances

Format : texte structuré avec des sections claires`;

      const response = await ollamaService.generate(prompt);
      setAnalysis(response);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12" role="main" aria-labelledby="page-title">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12" role="banner">
          <h1 id="page-title" className="text-4xl font-bold text-green-900 mb-4">
            Notre Impact Écologique
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Chez StoaViva, nous nous engageons pour un avenir durable. Découvrez nos initiatives
            et suivez nos progrès en matière de développement durable.
          </p>
        </div>

        {/* Graphiques d'impact */}
        <div className="mb-12" role="region" aria-label="Graphiques d'impact écologique">
          <EcoImpactChart />
        </div>

        {/* Analyse IA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md" role="region" aria-labelledby="analysis-title">
            <h2 id="analysis-title" className="text-2xl font-semibold text-green-900 mb-6">
              Analyse Détaillée
            </h2>

            <button
              onClick={generateAnalysis}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors mb-6"
              aria-label={loading ? "Analyse en cours" : "Générer une analyse de l'impact écologique"}
              aria-busy={loading}
            >
              {loading ? 'Analyse en cours...' : 'Générer une analyse'}
            </button>

            {analysis && (
              <div className="prose prose-green max-w-none" role="region" aria-label="Résultats de l'analyse">
                <div className="whitespace-pre-wrap" aria-live="polite">
                  {analysis}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Engagements */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" role="region" aria-label="Initiatives écologiques">
          <div className="bg-white p-6 rounded-lg shadow-md" role="region" aria-labelledby="engagements-title">
            <h3 id="engagements-title" className="text-xl font-semibold text-green-900 mb-4">
              Nos Engagements
            </h3>
            <ul className="space-y-3 text-green-800" role="list" aria-label="Liste des engagements">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Réduction des emballages plastiques
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Utilisation d'énergies renouvelables
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sourcing local et responsable
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md" role="region" aria-labelledby="actions-title">
            <h3 id="actions-title" className="text-xl font-semibold text-green-900 mb-4">
              Actions en Cours
            </h3>
            <ul className="space-y-3 text-green-800" role="list" aria-label="Liste des actions en cours">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Programme de recyclage
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Optimisation logistique
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Formation éco-responsable
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md" role="region" aria-labelledby="objectifs-title">
            <h3 id="objectifs-title" className="text-xl font-semibold text-green-900 mb-4">
              Objectifs 2024
            </h3>
            <ul className="space-y-3 text-green-800" role="list" aria-label="Liste des objectifs 2024">
              <li className="flex items-start" role="listitem">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                -30% d'emballages plastiques
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                100% fournisseurs locaux
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Neutralité carbone
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
