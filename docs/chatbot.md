# Module Chatbot

<<<<<<< HEAD
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
=======
## Description
Le Chatbot est un composant interactif qui permet aux utilisateurs de communiquer avec l'assistant StoaViva. Il intègre des fonctionnalités avancées de gestion des bases de données Notion et d'interaction avec les modèles Ollama, ainsi que des connexions à divers services externes.

## Fonctionnalités

### 1. Interface Utilisateur
- Chat flottant avec bouton de toggle
- Bannière de connexions aux services externes
- Indicateurs de statut pour chaque service
- Sélecteur de modèle Ollama avec persistance du choix
- Barre d'outils avec actions rapides
- Zone de messages avec support pour texte, fichiers et images
- Barre de saisie avec bouton d'envoi

### 2. Gestion des Connexions

#### Services Supportés
- Notion : Gestion des bases de données et du contenu
- Steam : Intégration avec la plateforme de jeux
- Google Drive : Gestion des fichiers et documents
- Google : Services Google généraux
- YouTube : Intégration vidéo

#### État des Connexions
```typescript
interface ConnectionStatus {
  status: 'connected' | 'disconnected';
  error?: string;
}

// Exemple d'utilisation
const status = await connectionsService.checkStatus('notion');
if (status.status === 'connected') {
  // Service connecté
} else {
  console.error(status.error);
}
```

#### Gestion des Connexions
```typescript
// Connecter un service
await connectionsService.connect('notion');

// Vérifier tous les statuts
const statuses = await connectionsService.checkAllStatuses([
  'notion',
  'google-drive',
  'steam'
]);
```

### 3. Gestion des Modèles Ollama
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514

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

<<<<<<< HEAD
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
=======
#### Configuration
- Modèle par défaut configurable via `DEFAULT_OLLAMA_MODEL`
- Température et nombre de tokens configurables
- Logs détaillés des changements de modèle
- Persistance du choix de modèle entre les sessions

#### Suivi des Modèles
Le système trace l'utilisation des modèles :
```
Configuration Ollama: {
  endpoint: "http://127.0.0.1:11434/api",
  modelActuel: "codestral:latest",
  temperature: 0.7,
  maxTokens: 2048
}
Changement de modèle : codestral:latest -> mistral:7b
```

### 4. Modes de Chat

#### Chat Simple
- Réponses générales sans contexte spécifique
- Utilise le modèle Ollama sélectionné
- Idéal pour les questions générales

#### Chat Notion
- Réponses basées sur les données Notion
- Accès aux produits, services, calendrier, etc.
- Parfait pour les informations internes

#### Chat Fichier
- Analyse de documents texte et PDF
- Extraction d'informations des images
- Permet de poser des questions sur le contenu

### 5. Gestion des Fichiers et Images

#### Formats Supportés
- Documents : .txt, .pdf, .doc, .docx
- Images : .jpg, .jpeg, .png, .gif

#### Fonctionnalités
- Téléversement avec barre de progression
- Analyse automatique du contenu
- Extraction d'informations clés
- Questions/réponses sur le document

## Tests Unitaires

### Composants Testés
1. **ChatError**
   - Affichage des erreurs
   - Historique des erreurs
   - Effets visuels

2. **ConnectionStatus**
   - État des connexions
   - Mise à jour des statuts
   - Gestion des erreurs

3. **Hooks**
   - useChatError
   - useChatConnection
   - Gestion d'état
   - Effets secondaires

### Patterns de Test
1. **Arrange-Act-Assert (AAA)**
2. **Given-When-Then**
3. **Test Pyramid**

### Exemple de Tests
```typescript
describe('ConnectionStatus', () => {
  it('should display correct status for each service', () => {
    const connections = [
      { name: 'Notion', isConnected: true },
      { name: 'Google Drive', isConnected: false }
    ];
    
    const { getByText } = render(
      <ConnectionStatus connections={connections} />
    );
    
    expect(getByText('Notion')).toBeInTheDocument();
    expect(getByText('Google Drive')).toBeInTheDocument();
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
  });
});

<<<<<<< HEAD
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
=======
describe('useChatConnection', () => {
  it('should handle connection status changes', async () => {
    const { result } = renderHook(() => useChatConnection());
    
    act(() => {
      result.current.connect('notion');
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe('connected');
    });
  });
});
```

## Gestion des Erreurs

Le composant gère plusieurs types d'erreurs :

1. **Erreurs de Connexion**
   - Service non disponible
   - Authentification échouée
   - Timeout de connexion

2. **Erreurs de Service**
   - API inaccessible
   - Limite d'utilisation dépassée
   - Erreurs de permission

3. **Erreurs de Validation**
   - Paramètres invalides
   - Format de données incorrect
   - Configuration manquante

## Bonnes Pratiques

1. **Gestion des Connexions**
   - Vérification régulière des statuts
   - Reconnexion automatique
   - Cache des états de connexion

2. **Performance**
   - Limitation des appels API
   - Mise en cache des réponses
   - Optimisation des requêtes

3. **Sécurité**
   - Validation des entrées
   - Gestion sécurisée des tokens
   - Protection contre les injections

## Personnalisation

Le composant peut être personnalisé via des props :

```typescript
interface ChatbotProps {
  defaultModel?: string;      // Modèle Ollama par défaut
  theme?: 'light' | 'dark';   // Thème visuel
  position?: 'left' | 'right'; // Position du chat
  autoOpen?: boolean;         // Ouverture automatique
  maxHeight?: number;         // Hauteur maximale
  services?: string[];        // Services à activer
  refreshInterval?: number;   // Intervalle de rafraîchissement des statuts
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
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

<<<<<<< HEAD
## Tests
=======
1. Certains services nécessitent une configuration manuelle
2. Les connexions peuvent être instables sur certains réseaux
3. La reconnexion automatique peut échouer dans certains cas
4. Certaines fonctionnalités avancées nécessitent des permissions spéciales
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514

Les tests sont écrits avec Jest et Testing Library. Pour exécuter les tests :

<<<<<<< HEAD
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
=======
- [ ] Support pour plus de services externes
- [ ] Interface de configuration visuelle
- [ ] Amélioration de la gestion des erreurs
- [ ] Support pour l'authentification OAuth
- [ ] Synchronisation des données hors ligne
- [ ] Historique des connexions
>>>>>>> 3803e13fa6ff683657b83b8940b93be439375514
