# Documentation du Composant ProductCard

## Vue d'ensemble
Le composant `ProductCard` est un composant React/Next.js qui affiche une carte de produit interactive. Il est conçu pour être utilisé dans la page de listing des produits de l'application Stoaviva.

## Structure du Composant

### Imports
```tsx
import Image from 'next/image';
```
- Utilise le composant `Image` de Next.js pour une gestion optimisée des images

### Composant Principal
```tsx
export default function ProductCard()
```
- Composant fonctionnel exporté par défaut
- Ne prend actuellement aucun props (pourrait être étendu pour accepter les données du produit)

## Éléments UI

### Container Principal
```tsx
<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
```
- Fond blanc avec coins arrondis
- Ombre légère par défaut
- Effet de survol avec ombre plus prononcée
- Animation de transition sur l'ombre

### Section Image
```tsx
<div className="relative aspect-square">
  <Image
    src="/images/product-placeholder.jpg"
    alt="Produit"
    fill
    className="object-cover"
  />
</div>
```
- Container avec ratio 1:1 (carré)
- Utilise le composant Image optimisé de Next.js
- Image redimensionnée pour couvrir le container

### Section Détails
```tsx
<div className="p-4">
  <h3>Nom du Produit</h3>
  <p>Description courte du produit</p>
  <div>Prix + Bouton</div>
</div>
```
- Padding intérieur de 1rem (16px)
- Affiche le nom, la description et les actions du produit

## Styles (Tailwind CSS)

### Typographie
- Titre: `text-lg font-semibold text-green-900`
- Description: `text-sm text-gray-600`
- Prix: `text-lg font-bold text-green-700`

### Bouton d'Action
```tsx
<button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
```
- Fond vert avec texte blanc
- Padding horizontal de 1rem et vertical de 0.5rem
- Coins arrondis
- Effet de survol avec vert plus foncé
- Transition animée sur le changement de couleur

## Améliorations Possibles

1. **Props**
   - Ajouter des props pour les données du produit:
     ```tsx
     interface ProductCardProps {
       name: string;
       description: string;
       price: number;
       imageUrl: string;
     }
     ```

2. **Gestion d'Erreur**
   - Ajouter une gestion des erreurs pour le chargement des images
   - Implémenter une image par défaut

3. **Interactivité**
   - Ajouter une fonction de callback pour le bouton "Ajouter au panier"
   - Implémenter une animation lors de l'ajout au panier

4. **Accessibilité**
   - Ajouter des attributs ARIA appropriés
   - Améliorer la navigation au clavier

## Utilisation

```tsx
// Exemple d'utilisation future avec props
<ProductCard
  name="Nom du Produit"
  description="Description courte du produit"
  price={19.99}
  imageUrl="/images/product.jpg"
/>
