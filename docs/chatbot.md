# Module Chatbot

Le module chatbot est une fonctionnalité clé de StoaViva qui permet aux utilisateurs d'interagir avec l'application via une interface conversationnelle intelligente.

## Structure du Module

```
src/features/chatbot/
├── api/
│   └── route.ts           # API route pour les requêtes du chatbot
├── components/
│   ├── Chatbot.tsx       # Composant principal du chatbot
│   └── Chatbot.test.tsx  # Tests du composant
├── services/
│   └── ollama.ts         # Service d'intégration avec Ollama
└── index.ts              # Point d'entrée du module
```

## Fonctionnalités

### 1. Modes de Conversation

- **Mode Simple**: Chat général sans contexte spécifique
- **Mode Notion**: Interaction avec la base de données Notion
- **Mode Fichier**: Analyse et discussion autour de fichiers uploadés

### 2. Intégration Notion

- Interrogation des produits et services
- Personnalisation des bases de données
- Contexte enrichi pour les réponses

### 3. Outils Natifs

- Chat simple
- Personnalisation de base de données
- Intégration avec le canevas pour la visualisation

## Configuration

### Variables d'Environnement

```env
OLLAMA_API_ENDPOINT=http://127.0.0.1:11434/api
NOTION_API_KEY=your_notion_api_key
```

### Modèles Ollama Supportés

- codestral:latest (par défaut)
- llama3.1:8b
- Autres modèles compatibles Ollama

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
}
```

## API

### Route POST /api/chat

Endpoint principal pour les interactions avec le chatbot.

#### Requête

```json
{
  "message": "string",
  "model": "string",
  "mode": "simple" | "notion" | "file",
  "context": {
    "filename": "string",
    "content": "string",
    "type": "string"
  }
}
```

#### Réponse

```json
{
  "response": "string",
  "error": "string"
}
```

## Tests

Les tests sont écrits avec Jest et Testing Library. Pour exécuter les tests :

```bash
npm test src/features/chatbot
```

## Développement

### Ajout d'un Nouveau Mode

1. Ajouter le type dans `components/Chatbot.tsx`
2. Implémenter la logique dans le service approprié
3. Mettre à jour l'interface utilisateur
4. Ajouter les tests correspondants

### Intégration d'un Nouveau Modèle

1. Ajouter le modèle dans le service Ollama
2. Mettre à jour la liste des modèles supportés
3. Tester les performances et la compatibilité

## Bonnes Pratiques

1. Toujours utiliser le système de typage TypeScript
2. Maintenir une couverture de tests complète
3. Documenter les changements majeurs
4. Suivre les conventions de commit (feat, fix, docs, etc.)

## Dépannage

### Problèmes Courants

1. **Erreur de connexion Ollama**
   - Vérifier que le service Ollama est en cours d'exécution
   - Vérifier l'URL de l'endpoint

2. **Erreur de connexion Notion**
   - Vérifier la validité de la clé API
   - Vérifier les permissions de la base de données

3. **Problèmes de Performance**
   - Réduire la taille du contexte
   - Utiliser un modèle plus léger
   - Mettre en cache les réponses fréquentes
