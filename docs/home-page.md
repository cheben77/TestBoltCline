# Documentation de la Page d'Accueil

## Vue d'ensemble
La page d'accueil (`/src/app/page.tsx`) est la page principale de l'application Stoaviva. Elle présente une vue d'ensemble des produits et services offerts, avec une mise en page moderne et responsive.

## Structure de la Page

### Imports
```tsx
import Link from 'next/link';
```
- Utilise le composant `Link` de Next.js pour la navigation interne

### Composant Principal
```tsx
export default function Home()
```
- Page d'accueil principale
- Utilise Tailwind CSS pour le style

## Sections

### 1. Hero Section
```tsx
<section className="bg-green-100 py-20">
```
- Section d'en-tête principale
- Fond vert clair
- Contient:
  - Titre principal "Bienvenue chez StoaViva"
  - Sous-titre descriptif
  - Boutons d'action (Produits et Services)
- Styles:
  - Titre: `text-5xl font-bold text-green-900`
  - Sous-titre: `text-xl text-green-800`
  - Layout: Centré avec `text-center`

#### Boutons de Navigation
```tsx
<div className="flex justify-center gap-4">
```
- Deux boutons principaux:
  1. "Nos Produits" (`/produits`)
     - Style: `bg-green-700` (vert foncé)
  2. "Nos Services" (`/services`)
     - Style: `bg-green-500` (vert moyen)
- Effets de survol et transitions

### 2. Section Produits Phares
```tsx
<section className="container mx-auto px-4 py-16">
```
- Présentation des produits vedettes
- Titre: "Produits Phares"
- Grille responsive pour les cartes de produits
- Structure préparée pour l'intégration des ProductCards

### 3. Section Services Populaires
```tsx
<section className="bg-green-50 py-16">
```
- Présentation des services populaires
- Fond vert très clair
- Titre: "Services Populaires"
- Grille responsive pour les cartes de services

## Design Responsive

### Grilles
- Mobile: 1 colonne (`grid-cols-1`)
- Tablette/Desktop: 3 colonnes (`md:grid-cols-3`)
- Espacement: `gap-8` entre les éléments

### Container
- Largeur maximale automatique: `container mx-auto`
- Padding horizontal: `px-4`
- Padding vertical variable selon les sections

## Styles (Tailwind CSS)

### Layout
- Container principal: `min-h-screen bg-gray-50`
- Sections: Alternance de fonds (`bg-green-100`, `bg-green-50`)
- Espacement vertical: `py-16`, `py-20`

### Typographie
- Titres:
  - Principal: `text-5xl font-bold text-green-900`
  - Sections: `text-3xl font-bold text-green-900`
- Sous-titre: `text-xl text-green-800`

### Boutons
- Base: `px-8 py-3 rounded-lg text-white`
- Produits: `bg-green-700 hover:bg-green-800`
- Services: `bg-green-500 hover:bg-green-600`
- Transition: `transition-colors`

## Améliorations Possibles

1. **Contenu Dynamique**
   - Intégrer les ProductCards dans la section Produits Phares
   - Créer et intégrer des ServiceCards
   - Charger les données depuis une API

2. **Interactivité**
   - Ajouter des animations au défilement
   - Implémenter un carrousel pour les produits/services
   - Ajouter des effets de hover plus élaborés

3. **Performance**
   - Optimiser le chargement des images
   - Implémenter le chargement différé des sections
   - Ajouter des placeholders de chargement

4. **SEO**
   - Ajouter des métadonnées
   - Optimiser les balises title et description
   - Implémenter le schema.org markup

5. **Accessibilité**
   - Améliorer la structure des headings
   - Ajouter des descriptions ARIA
   - Optimiser la navigation au clavier

6. **Fonctionnalités**
   - Ajouter une barre de recherche
   - Intégrer un système de newsletter
   - Ajouter une section témoignages
