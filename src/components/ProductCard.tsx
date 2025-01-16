import Image from 'next/image';
import { NotionProduct } from '@/lib/notion';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ecologicalImpact: string;
  benefits?: string;
  usageInstructions?: string;
  ingredients?: string[];
  certifications?: string[];
  stock?: number;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  description,
  ecologicalImpact,
  benefits,
  usageInstructions,
  ingredients,
  certifications,
  stock = 0
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      role="article"
      aria-labelledby={`product-${id}-title`}
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src="/images/product-placeholder.svg"
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
      <h3 id={`product-${id}-title`} className="text-lg font-semibold text-green-900 mb-2">
        {name}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-green-700">€{price}</span>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            aria-label={`Ajouter ${name} au panier`}
          >
            Ajouter au panier
          </button>
        </div>
        <div className="mt-2">
          <span 
            className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded"
            role="status"
          >
            {category}
          </span>
          {stock > 0 ? (
            <span className="ml-2 text-xs text-green-600" role="status" aria-live="polite">
              En stock: {stock}
            </span>
          ) : (
            <span className="ml-2 text-xs text-red-600" role="status" aria-live="polite">
              Rupture de stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
