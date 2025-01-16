import { useEffect, useState } from 'react';

interface EcoMetric {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  category: string;
  date: string;
  description: string;
  improvement_actions: string;
}

export default function EcoImpactChart() {
  const [metrics, setMetrics] = useState<EcoMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEcoData() {
      try {
        const response = await fetch('/api/notion?type=eco-impact');
        if (!response.ok) throw new Error('Erreur réseau');
        
        const { data } = await response.json();
        if (!data) throw new Error('Données non trouvées');
        
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEcoData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!Array.isArray(metrics) || metrics.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucune donnée d'impact écologique disponible
      </div>
    );
  }

  // Grouper les métriques par catégorie
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, EcoMetric[]>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-green-900 mb-6">
        Impact Écologique
      </h3>

      <div className="space-y-8">
        {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-lg font-medium text-green-800">
              {category}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryMetrics.map((metric) => (
                <div
                  key={metric.metric_name}
                  className="bg-green-50 p-4 rounded-lg"
                >
                  <div className="text-sm text-green-600 mb-1">
                    {metric.metric_name}
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <div className="text-2xl font-bold text-green-700">
                      {metric.value}
                    </div>
                    <div className="text-sm text-green-600 mb-1">
                      {metric.unit}
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${metric.unit === 'pourcentage' ? metric.value : (metric.value / 100) * 100}%`
                      }}
                    />
                  </div>

                  <div className="text-xs text-green-600 mt-2">
                    Dernière mise à jour : {new Date(metric.date).toLocaleDateString()}
                  </div>

                  {metric.description && (
                    <div className="mt-2 text-sm text-green-700">
                      {metric.description}
                    </div>
                  )}

                  {metric.improvement_actions && (
                    <div className="mt-2 text-xs italic text-green-600">
                      Actions : {metric.improvement_actions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
