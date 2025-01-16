import { NextResponse } from 'next/server';
import { notionService } from '@/services/notion';
import { mockProducts } from '@/data/mockData';

const isDev = process.env.NODE_ENV === 'development';

export async function GET() {
  try {
    if (isDev) {
      return NextResponse.json({ products: mockProducts });
    }

    const products = await notionService.getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}
