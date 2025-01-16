'use client';

import ProductCard from '@/components/ProductCard';
import ProductAnalysis from '@/components/ProductAnalysis';
import { useNotionProducts } from '@/hooks/useNotion';

export default function Produits() {
  const { products, loading, error } = useNotionProducts();

  return (
    <main className="min-h-screen bg-gray-50" role="main" aria-labelledby="page-title">
      {/* Section Analyse */}
      <ProductAnalysis />

      {/* Hero Section */}
      <section className="bg-green-100 py-20" role="banner">
        <div className="container mx-auto px-4">
          <h1 id="page-title" className="text-5xl font-bold text-green-900 mb-4">
            Nos Produits Écologiques
          </h1>
          <p className="text-xl text-green-800">
            Découvrez notre sélection de produits naturels et durables
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1" role="complementary" aria-label="Filtres de produits">
            <h2 className="text-xl font-bold text-green-900 mb-4" id="filters-heading">Filtres</h2>
            <div className="space-y-4">
              {/* Category Filter */}
              <div role="group" aria-labelledby="categories-heading">
                <h3 id="categories-heading" className="font-semibold text-green-800 mb-2">Catégories</h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <label className="flex items-center" role="listitem">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        aria-label="Filtrer par Santé & Bien-être" 
                      />
                      Santé & Bien-être
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center" role="listitem">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        aria-label="Filtrer par Matériel Nature & Aventure" 
                      />
                      Matériel Nature & Aventure
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center" role="listitem">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        aria-label="Filtrer par Livres & Éducation" 
                      />
                      Livres & Éducation
                    </label>
                  </li>
                </ul>
              </div>

              {/* Price Filter */}
              <div role="group" aria-labelledby="price-heading">
                <h3 id="price-heading" className="font-semibold text-green-800 mb-2">Prix</h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  aria-label="Filtrer par prix"
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3" role="main" aria-label="Liste des produits">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {loading ? (
                <div className="col-span-full text-center py-8" role="status" aria-live="polite">
                  Chargement des produits...
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-8 text-red-600" role="alert">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-8" role="status" aria-live="polite">
                  Aucun produit disponible
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    description={product.description}
                    ecologicalImpact={product.ecological_impact}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
