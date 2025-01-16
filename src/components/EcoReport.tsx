import { useState } from 'react';

interface EcoReportProps {
  onGenerate: () => Promise<void>;
  loading: boolean;
}

export default function EcoReport({ onGenerate, loading }: EcoReportProps) {
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    try {
      setError(null);
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'eco-report',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-green-900 mb-4">
        Rapport d'Impact Écologique
      </h3>

      <div className="space-y-4">
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Génération en cours...' : 'Générer un Rapport'}
        </button>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {report && (
          <div className="mt-6">
            <div className="prose prose-green max-w-none">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-green-900 mb-3">
                  Résultats de l'Analyse
                </h4>
                <div className="whitespace-pre-wrap text-green-800">
                  {report}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  // Télécharger le rapport au format texte
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'rapport-ecologique.txt';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Télécharger le Rapport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
