# Module Chatbot

Le module chatbot est une fonctionnalité clé de StoaViva qui permet aux utilisateurs d'interagir avec l'application via une interface conversationnelle intelligente.

## Structure du Module

```
src/features/chatbot/
├── api/
│   └── route.ts           # API route pour les requêtes du chatbot
├── components/
│   ├── Chatbot.tsx       # Composant principal du chatbot
│   ├── Chatbot.test.tsx  # Tests du composant principal
│   ├── ChatError.tsx     # Composant d'affichage des erreurs
│   └── ChatError.test.tsx # Tests du composant d'erreur
├── hooks/
│   ├── useChatbot.ts     # Hook principal de gestion du chat
│   └── useChatError.ts   # Hook de gestion des erreurs
├── services/
│   └── ollama.ts         # Service d'intégration avec Ollama
└── index.ts              # Point d'entrée du module
```

## Fonctionnalités

### 1. Modes de Conversation

- **Mode Simple**: Chat général sans contexte spécifique
- **Mode Notion**: Interaction avec la base de données Notion
- **Mode Fichier**: Analyse et discussion autour de fichiers uploadés

### 2. Gestion des Erreurs

Le module intègre un système robuste de gestion des erreurs :

#### Types d'Erreurs
- `network`: Problèmes de connexion
- `notion`: Erreurs liées à la base de données
- `ollama`: Erreurs de génération de réponses
- `file`: Problèmes de traitement de fichiers
- `validation`: Erreurs de validation des données

#### Composants et Hooks
- `useChatError`: Hook personnalisé pour la gestion centralisée des erreurs
- `ChatError`: Composant réutilisable pour l'affichage des erreurs
- Historique des erreurs avec possibilité de retry
- Messages d'erreur contextuels et détails techniques

### 3. Intégration Notion

- Interrogation des produits et services
- Personnalisation des bases de données
- Contexte enrichi pour les réponses

## Configuration

### Variables d'Environnement

```env
OLLAMA_API_ENDPOINT=http://127.0.0.1:11434/api
NOTION_API_KEY=your_notion_api_key
```

## Utilisation

### Import du Composant

```tsx
import { Chatbot } from '@/features/chatbot';

export default function Page() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}
```

### Gestion des Erreurs

```tsx
import { useChatError, ChatError } from '@/features/chatbot';

function MyComponent() {
  const { error, handleError, clearError } = useChatError({
    maxHistoryLength: 10,
    onError: (error) => console.error(error)
  });

  return error ? (
    <ChatError
      error={error}
      onRetry={() => {
        // Logique de retry
        clearError();
      }}
      onDismiss={clearError}
    />
  ) : null;
}
```

### Personnalisation

Le chatbot peut être personnalisé via les props suivantes :

```tsx
interface ChatbotProps {
  initialMode?: 'simple' | 'notion' | 'file';
  defaultModel?: string;
  theme?: {
    primaryColor?: string;
    textColor?: string;
  };
  onError?: (error: ChatError) => void;
}
```

## Tests

Les tests sont écrits avec Jest et Testing Library. Pour exécuter les tests :

```bash
npm test src/features/chatbot
```

### Couverture des Tests

- Tests unitaires pour les composants
- Tests d'intégration pour les hooks
- Tests de gestion d'erreurs
- Tests d'accessibilité

## Bonnes Pratiques

1. Gestion des Erreurs
   - Utiliser le hook `useChatError` pour la gestion centralisée
   - Fournir des messages d'erreur clairs et des solutions
   - Implémenter des mécanismes de retry quand approprié

2. Accessibilité
   - Utilisation appropriée des rôles ARIA
   - Messages d'erreur clairs et lisibles
   - Support du clavier

3. Performance
   - Mise en cache des réponses fréquentes
   - Chargement optimisé des modèles
   - Gestion efficace de l'état

## Dépannage

### Problèmes Courants

1. **Erreur de connexion Ollama**
   - Vérifier que le service est en cours d'exécution
   - Vérifier l'URL de l'endpoint
   - Consulter les logs pour plus de détails

2. **Erreur de connexion Notion**
   - Vérifier la validité de la clé API
   - Vérifier les permissions de la base de données
   - Consulter l'historique des erreurs

3. **Problèmes de Performance**
   - Réduire la taille du contexte
   - Utiliser un modèle plus léger
   - Vérifier la mémoire cache

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Ajouter des tests pour les nouvelles fonctionnalités
4. Mettre à jour la documentation
5. Soumettre une Pull Request
