# Documentation des Styles Globaux

## Vue d'ensemble
Le fichier `globals.css` définit les styles de base et la configuration Tailwind CSS pour l'application Stoaviva. Il établit une cohérence visuelle à travers l'application.

## Configuration Tailwind

### Imports de Base
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Importe les styles de base, composants et utilitaires de Tailwind

## Styles de Base (@layer base)

### Body
```css
body {
  @apply bg-gray-50 text-gray-900;
}
```
- Fond gris clair par défaut
- Texte presque noir pour une bonne lisibilité

### Hiérarchie des Titres
```css
h1 {
  @apply text-4xl font-bold text-primary;
}

h2 {
  @apply text-3xl font-semibold text-secondary;
}

h3 {
  @apply text-2xl font-medium text-accent;
}
```
- Hiérarchie claire avec tailles et poids de police différents
- Utilisation des couleurs thématiques (primary, secondary, accent)

### Liens
```css
a {
  @apply text-primary hover:text-primary/80 transition-colors;
}
```
- Couleur primaire par défaut
- Effet de hover avec opacité réduite
- Transition fluide des couleurs

### Boutons
```css
button {
  @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors;
}
```
- Style de base pour tous les boutons
- Fond de couleur primaire
- Coins arrondis
- Effet de hover avec opacité légèrement réduite

## Thème Sombre

### Variables CSS
```css
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}
```
- Définition des couleurs de base en mode clair

### Media Query pour le Mode Sombre
```css
@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}
```
- Adaptation automatique au mode sombre du système
- Inversion des couleurs pour le texte et le fond

### Gradient de Fond
```css
body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(var(--background-end-rgb))
  )
  rgb(var(--background-start-rgb));
}
```
- Gradient subtil pour le fond
- S'adapte automatiquement au mode clair/sombre

## Bonnes Pratiques

1. **Organisation des Styles**
   - Utilisation de @layer pour organiser les styles
   - Séparation claire entre les styles de base et les utilitaires

2. **Accessibilité**
   - Contraste suffisant entre le texte et le fond
   - Tailles de police lisibles
   - Support du mode sombre

3. **Maintenabilité**
   - Utilisation des classes Tailwind pour la cohérence
   - Variables CSS pour les valeurs réutilisables
   - Structure modulaire des styles

## Améliorations Possibles

1. **Personnalisation**
   - Ajouter plus de variables CSS personnalisées
   - Créer des variantes de composants

2. **Thèmes**
   - Implémenter un système de thèmes multiples
   - Ajouter des préférences utilisateur

3. **Performance**
   - Optimiser les sélecteurs CSS
   - Réduire la taille du bundle CSS

4. **Accessibilité**
   - Ajouter des styles focus visibles
   - Améliorer les contrastes
   - Support des préférences de mouvement réduit
