# Canvas Component

Le composant Canvas est un éditeur visuel de workflows qui permet de créer, modifier et visualiser des workflows d'automatisation.

## Fonctionnalités

- Création de nouveaux workflows
- Édition de workflows existants
- Prévisualisation des workflows avec leurs étapes
- Gestion des paramètres pour chaque étape
- Liste des triggers disponibles
- Interface intuitive avec retour visuel

## Installation

Le composant Canvas fait partie du projet Stoaviva. Il nécessite les dépendances suivantes :

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^4.0.0"
  }
}
```

## Utilisation

```tsx
import Canvas from '../components/Canvas';
import { Workflow } from '../lib/triggers';

// Gestionnaire de sauvegarde
const handleSave = (workflow: Workflow) => {
  // Traitement du workflow sauvegardé
  console.log('Workflow saved:', workflow);
};

// Utilisation du composant
function App() {
  return (
    <Canvas onSave={handleSave} />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSave | `(workflow: Workflow) => void` | Non | Callback appelé lors de la sauvegarde d'un workflow |

## Structure des données

### Workflow

```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  firstStepId: string;
  steps: Record<string, WorkflowStep>;
  triggers: {
    trigger: Trigger;
    params: Record<string, any>;
  }[];
  status?: 'active' | 'inactive' | 'error';
  createdAt?: Date;
  updatedAt?: Date;
}
```

### WorkflowStep

```typescript
interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  triggerId: string;
  trigger: Trigger;
  params: Record<string, any>;
  nextStepId?: string;
}
```

## États et Transitions

Le composant Canvas gère plusieurs états :

1. **État initial** : Affiche un message invitant à créer un workflow
2. **État d'édition** : Affiche le WorkflowBuilder pour créer/modifier un workflow
3. **État de prévisualisation** : Affiche le workflow créé avec ses étapes

## Styles

Le composant utilise des styles CSS modulaires définis dans `Canvas.css`. Les principaux éléments stylisés sont :

- `.canvas` : Conteneur principal
- `.canvas-header` : En-tête avec titre et boutons d'action
- `.workflow-preview` : Affichage du workflow
- `.workflow-steps` : Liste des étapes
- `.triggers-list` : Liste des triggers disponibles

## Bonnes pratiques

1. **Gestion des erreurs** :
   - Validez les données du workflow avant la sauvegarde
   - Affichez des messages d'erreur explicites
   - Permettez l'annulation des modifications

2. **Performance** :
   - Utilisez la mémoisation pour les callbacks
   - Évitez les re-rendus inutiles
   - Chargez les données de manière asynchrone

3. **Accessibilité** :
   - Utilisez des rôles ARIA appropriés
   - Assurez la navigation au clavier
   - Fournissez des textes alternatifs

## Tests

Les tests sont définis dans `Canvas.test.tsx` et couvrent :

- Rendu initial
- Création de workflow
- Édition de workflow
- Prévisualisation
- Gestion des erreurs

Pour exécuter les tests :

```bash
npm test
```

## Exemples

### Création d'un workflow simple

```tsx
const SimpleWorkflow = () => {
  const handleSave = (workflow: Workflow) => {
    // Sauvegarde dans une base de données
    saveToDatabase(workflow);
  };

  return (
    <div className="container">
      <h1>Mon Workflow</h1>
      <Canvas onSave={handleSave} />
    </div>
  );
};
```

### Workflow avec état initial

```tsx
const ExistingWorkflow = () => {
  const [workflow, setWorkflow] = useState<Workflow>(existingWorkflow);

  const handleSave = (updatedWorkflow: Workflow) => {
    setWorkflow(updatedWorkflow);
    saveToDatabase(updatedWorkflow);
  };

  return (
    <Canvas
      initialWorkflow={workflow}
      onSave={handleSave}
    />
  );
};
```

## Contribution

Pour contribuer au développement du composant Canvas :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Ajoutez vos modifications
4. Écrivez des tests
5. Soumettez une pull request

## Licence

MIT License
