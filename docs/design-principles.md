# Principes de Design StoaViva : Ergonomie, Fibonacci et Nombre d'Or

## Vue d'ensemble

Ce document définit les principes de design appliqués dans StoaViva, combinant ergonomie, suite de Fibonacci et nombre d'or pour créer une expérience utilisateur harmonieuse et naturelle.

## Objectifs

1. **Esthétisme Naturel**
   - Utilisation du nombre d'or (1,618) pour les proportions
   - Progression naturelle inspirée de la suite de Fibonacci
   - Harmonie visuelle cohérente avec l'identité StoaViva

2. **Ergonomie Optimale**
   - Interface centrée utilisateur
   - Réduction de la fatigue visuelle et cognitive
   - Navigation intuitive et efficace

3. **Fonctionnalité**
   - Organisation logique des éléments
   - Hiérarchie visuelle claire
   - Accessibilité optimisée

## Application des Principes

### 1. Layout et Grille

#### Proportions Dorées
```css
:root {
  /* Ratio d'or : 1.618 */
  --golden-ratio: 1.618;
  
  /* Espacements basés sur Fibonacci */
  --space-xs: 8px;    /* 8 */
  --space-sm: 13px;   /* 13 */
  --space-md: 21px;   /* 21 */
  --space-lg: 34px;   /* 34 */
  --space-xl: 55px;   /* 55 */
  
  /* Conteneurs */
  --container-sm: 610px;  /* ≈ 377 * 1.618 */
  --container-md: 987px;  /* ≈ 610 * 1.618 */
  --container-lg: 1597px; /* ≈ 987 * 1.618 */
}
```

#### Grille Responsive
```typescript
// Composant Grid utilisant Fibonacci
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(233px, 1fr)); /* 233 = 144 * 1.618 */
  gap: var(--space-md);
  padding: var(--space-lg);
`;
```

### 2. Typographie

#### Échelle Typographique
```css
:root {
  /* Tailles de police basées sur Fibonacci */
  --text-xs: 13px;   /* 13 */
  --text-sm: 21px;   /* 21 */
  --text-md: 34px;   /* 34 */
  --text-lg: 55px;   /* 55 */
  --text-xl: 89px;   /* 89 */
  
  /* Interlignage basé sur le nombre d'or */
  --line-height: 1.618;
}
```

#### Hiérarchie Textuelle
```typescript
const Typography = {
  h1: {
    fontSize: 'var(--text-xl)',
    lineHeight: 'var(--line-height)',
    marginBottom: 'var(--space-lg)',
  },
  h2: {
    fontSize: 'var(--text-lg)',
    lineHeight: 'var(--line-height)',
    marginBottom: 'var(--space-md)',
  },
  // ...
};
```

### 3. Composants

#### Cards et Conteneurs
```typescript
const ProductCard = styled.div`
  /* Proportions basées sur le nombre d'or */
  aspect-ratio: 1.618;
  padding: var(--space-md);
  
  /* Progression Fibonacci pour les marges */
  margin-bottom: var(--space-lg);
  
  /* Coins arrondis harmonieux */
  border-radius: var(--space-xs);
`;
```

#### Navigation
```typescript
const Navigation = styled.nav`
  /* Espacement des éléments selon Fibonacci */
  > * + * {
    margin-left: var(--space-md);
  }
  
  /* Hauteur basée sur le nombre d'or */
  height: calc(var(--space-xl) * var(--golden-ratio));
`;
```

### 4. Animations et Transitions

```typescript
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.618); /* Inverse du nombre d'or */
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimatedComponent = styled.div`
  animation: ${fadeIn} 0.618s ease-out;
`;
```

## Ergonomie et UX

### 1. Principes d'Interaction

- **Loi de Fitts** : Taille des cibles proportionnelle à leur importance
- **Loi de Hick** : Limitation des choix pour une décision plus rapide
- **Gestalt** : Organisation visuelle naturelle des éléments

### 2. Accessibilité

```typescript
// Exemple de composant accessible
const Button = styled.button`
  /* Taille minimum pour une bonne ergonomie */
  min-height: var(--space-lg);
  min-width: var(--space-xl);
  
  /* Contraste et lisibilité */
  color: var(--color-text);
  background: var(--color-background);
  
  /* Focus visible */
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: var(--space-xs);
  }
`;
```

### 3. Responsive Design

```typescript
const ResponsiveLayout = styled.div`
  /* Breakpoints basés sur Fibonacci */
  @media (min-width: 610px) {  /* 377 * 1.618 */
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 987px) {  /* 610 * 1.618 */
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1597px) { /* 987 * 1.618 */
    grid-template-columns: repeat(4, 1fr);
  }
`;
```

## Implémentation

### 1. Configuration Globale

```typescript
// theme.ts
export const theme = {
  spacing: {
    xs: '8px',    // Fibonacci: 8
    sm: '13px',   // Fibonacci: 13
    md: '21px',   // Fibonacci: 21
    lg: '34px',   // Fibonacci: 34
    xl: '55px',   // Fibonacci: 55
  },
  
  typography: {
    ratio: 1.618,
    scale: {
      xs: '13px',
      sm: '21px',
      md: '34px',
      lg: '55px',
      xl: '89px',
    },
  },
  
  layout: {
    containerSm: '610px',
    containerMd: '987px',
    containerLg: '1597px',
  },
};
```

### 2. Utilisation dans les Composants

```typescript
// components/ProductGrid.tsx
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      calc(${theme.spacing.xl} * ${theme.typography.ratio}),
      1fr
    )
  );
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
`;
```

## Validation et Tests

### 1. Critères de Validation

- Respect des proportions dorées
- Cohérence des espacements Fibonacci
- Accessibilité WCAG 2.1
- Performance et fluidité des animations

### 2. Tests Utilisateurs

- Tests d'ergonomie
- Évaluation de la navigation
- Mesure des temps de complétion
- Retours sur le confort visuel

## Maintenance

### 1. Documentation

- Mise à jour du guide de style
- Documentation des composants
- Exemples d'utilisation

### 2. Évolution

- Revue périodique des principes
- Adaptation aux nouveaux besoins
- Intégration des retours utilisateurs

Cette documentation sert de référence pour maintenir une cohérence visuelle et ergonomique dans l'ensemble de l'application StoaViva, en s'appuyant sur des principes naturels et éprouvés de design.
