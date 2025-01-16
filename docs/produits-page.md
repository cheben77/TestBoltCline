# Documentation de la Page Produits

## Vue d'ensemble
La page Produits (`/src/app/produits/page.tsx`) est une page Next.js qui présente le catalogue de produits écologiques de Stoaviva. Elle intègre une section héro, des filtres de recherche, et une grille de produits utilisant le composant `ProductCard`.

## Structure de la Page

### Imports
```tsx
import ProductCard from '@/components/ProductCard';
```
- Importe le composant ProductCard depuis le dossier components

### Composant Principal
```tsx
export default function Produits()
```
- Page principale des produits
- Utilise une mise en page responsive avec Tailwind CSS

## Sections

### 1. Hero Section
```tsx
<section className="bg-green-100 py-20">
```
- Bannière en haut de la page
- Fond vert clair
- Contient:
  - Titre principal "Nos Produits Écologiques"
  - Sous-titre descriptif
- Styles:
  - Titre: `text-5xl font-bold text-green-900`
  - Sous-titre: `text-xl text-green-800`

### 2. Section Principale (Filtres et Produits)
```tsx
<section className="container mx-auto px-4 py-16">
```
- Layout en grille responsive
- Divisé en deux parties principales:
  1. Barre latérale de filtres
  2. Grille de produits

#### Barre Latérale de Filtres
```tsx
<aside className="lg:col-span-1">
```
- Occupe 1 colonne sur grand écran
- Contient:
  1. **Filtre par Catégories**
     - Liste de checkboxes
     - Catégories:
       - Santé & Bien-être
       - Matériel Nature & Aventure
       - Livres & Éducation
  2. **Filtre par Prix**
     - Slider de sélection de prix
     - Range: 0-100

#### Grille de Produits
```tsx
<div className="lg:col-span-3">
```
- Occupe 3 colonnes sur grand écran
- Grille responsive:
  - 1 colonne sur mobile
  - 2 colonnes sur tablette
  - 3 colonnes sur desktop
- Utilise le composant ProductCard

## Responsive Design

### Breakpoints
- Mobile: 1 colonne
- Tablette (md): 2 colonnes de produits
- Desktop (lg): 
  - 4 colonnes au total
  - 1 colonne pour les filtres
  - 3 colonnes pour les produits

### Classes Responsive
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`: Grille de produits adaptative
- `lg:col-span-1`: Barre latérale sur grand écran
- `lg:col-span-3`: Section produits sur grand écran

## Styles (Tailwind CSS)

### Layout
- Container: `container mx-auto px-4`
- Espacement: `gap-8`, `gap-6`, `space-y-4`
- Grille: `grid grid-cols-1 lg:grid-cols-4`

### Couleurs
- Fond page: `bg-gray-50`
- Fond hero: `bg-green-100`
- Texte: 
  - Titres: `text-green-900`
  - Sous-titres: `text-green-800`

## Améliorations Possibles

1. **État et Gestion des Filtres**
   - Implémenter la logique de filtrage
   - Ajouter un état pour les checkboxes
   - Gérer les événements de changement de prix

2. **Pagination**
   - Ajouter une pagination pour gérer de grandes listes de produits
   - Implémenter le chargement infini

3. **Recherche**
   - Ajouter une barre de recherche
   - Implémenter la recherche en temps réel

4. **Tri**
   - Ajouter des options de tri (prix, popularité, etc.)
   - Implémenter la logique de tri

5. **Performance**
   - Implémenter le chargement différé des images
   - Optimiser le rendu des listes

6. **Accessibilité**
   - Améliorer la navigation au clavier
   - Ajouter des labels ARIA appropriés
   - Optimiser pour les lecteurs d'écran
