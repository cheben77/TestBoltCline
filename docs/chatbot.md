# Documentation du Composant Chatbot

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

#### Sélection du Modèle
Le chatbot permet de choisir parmi différents modèles Ollama disponibles :
```typescript
// Récupération des modèles disponibles
const models = await listModels();
// ["llama3.1:8b", "codestral:latest", "mistral:7b", ...]
```

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
  });
});

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
}
```

## Dépendances

- `@notionhq/client` : Client API Notion
- `@modelcontextprotocol/sdk` : SDK MCP pour Ollama
- `react` : Framework UI
- `tailwindcss` : Styling

## Limitations Connues

1. Certains services nécessitent une configuration manuelle
2. Les connexions peuvent être instables sur certains réseaux
3. La reconnexion automatique peut échouer dans certains cas
4. Certaines fonctionnalités avancées nécessitent des permissions spéciales

## Roadmap

- [ ] Support pour plus de services externes
- [ ] Interface de configuration visuelle
- [ ] Amélioration de la gestion des erreurs
- [ ] Support pour l'authentification OAuth
- [ ] Synchronisation des données hors ligne
- [ ] Historique des connexions
