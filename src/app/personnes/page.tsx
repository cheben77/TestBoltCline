     'use client';

import PersonsList from '@/components/PersonsList';

export default function PersonsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12" role="main" aria-labelledby="page-title">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" role="banner">
          <h1 id="page-title" className="text-4xl font-bold text-green-900 mb-4">
            Gestion des Personnes
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Consultez et gérez la liste des personnes intéressées par nos services et produits.
          </p>
        </div>

        <div className="max-w-7xl mx-auto" role="region" aria-label="Liste des personnes">
          <PersonsList />
        </div>

        <div className="mt-12 text-center" role="complementary" aria-label="Information de synchronisation">
          <p className="text-sm text-gray-600" aria-live="polite">
            Les données sont automatiquement synchronisées avec Notion toutes les 5 minutes.
          </p>
        </div>
      </div>
    </main>
  );
}
