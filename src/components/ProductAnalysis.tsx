import { useState } from 'react';
import { AnalysisResult, KitSuggestion } from '@/lib/integration';

interface ProductAnalysisProps {
  analysisResult?: AnalysisResult;
  kitSuggestion?: KitSuggestion;
}

export default function ProductAnalysis({ analysisResult, kitSuggestion }: ProductAnalysisProps) {
  const [activeTab, setActiveTab] = useState('analysis');

  if (!analysisResult && !kitSuggestion) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucune analyse disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-4 px-6 ${
              activeTab === 'analysis'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analyse
          </button>
          <button
            onClick={() => setActiveTab('suggestion')}
            className={`py-4 px-6 ${
              activeTab === 'suggestion'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Suggestions
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'analysis' && analysisResult && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Résumé</h3>
              <p className="mt-2 text-gray-600">{analysisResult.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Impact Écologique</h3>
              <div className="mt-2">
                <p className="text-gray-600">{analysisResult.ecologicalImpact.current}</p>
                <ul className="mt-2 list-disc list-inside">
                  {analysisResult.ecologicalImpact.improvements.map((improvement, index) => (
                    <li key={index} className="text-gray-600">{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Recommandations</h3>
              <ul className="mt-2 list-disc list-inside">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-600">{recommendation}</li>
                ))}
              </ul>
            </div>

            {analysisResult.products && (
              <div>
                <h3 className="text-lg font-medium">Analyse par Produit</h3>
                <div className="mt-2 space-y-4">
                  {analysisResult.products.map((product) => (
                    <div key={product.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="mt-1 text-gray-600">{product.analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestion' && kitSuggestion && (
          <div className="space-y-6">
            {kitSuggestion.suggestion && (
              <div>
                <h3 className="text-lg font-medium">Vue d'ensemble</h3>
                <p className="mt-2 text-gray-600">{kitSuggestion.suggestion}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium">Produits Recommandés</h3>
              <div className="mt-2 space-y-4">
                {kitSuggestion.products.map((product) => (
                  <div key={product.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="mt-1 text-gray-600">{product.reason}</p>
                      </div>
                      <span className="text-green-600 font-medium">{product.price}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Services Recommandés</h3>
              <div className="mt-2 space-y-4">
                {kitSuggestion.services.map((service) => (
                  <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="mt-1 text-gray-600">{service.reason}</p>
                      </div>
                      <span className="text-green-600 font-medium">{service.price}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Bénéfices Attendus</h3>
              <ul className="mt-2 list-disc list-inside">
                {kitSuggestion.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold text-green-600">{kitSuggestion.totalPrice}€</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
