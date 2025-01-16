'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockData';

// Import dynamique des composants pour éviter les erreurs de SSR avec useState
const Chatbot = dynamic(() => import('@/components/Chatbot'), {
  ssr: false,
});

const EcoImpactChart = dynamic(() => import('@/components/EcoImpactChart'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-green-900 mb-6">
            Bienvenue chez StoaViva
          </h1>
          <p className="text-xl text-green-800 mb-8">
            Découvrez nos produits écologiques et services personnalisés pour votre bien-être
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/produits" className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors">
              Nos Produits
            </Link>
            <Link href="/services" className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors">
              Nos Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-900 mb-8">
          Produits Phares
        </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                description={product.description}
                ecologicalImpact={product.ecological_impact}
                benefits={product.benefits}
                usageInstructions={product.usage_instructions}
                ingredients={product.ingredients}
                certifications={product.certifications}
              />
            ))}
          </div>
      </section>

      {/* Featured Services */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 mb-8">
            Services Populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Cards */}
          </div>
        </div>
      </section>

      {/* Ecological Impact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Notre Impact Écologique
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Découvrez comment nos actions contribuent à la préservation de l'environnement
              et suivez nos progrès en temps réel.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <EcoImpactChart />
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/impact-ecologique"
              className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
            >
              En savoir plus sur nos initiatives
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </main>
  );
}
