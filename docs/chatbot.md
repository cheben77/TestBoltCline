# Documentation du Composant Chatbot

## Description
Le Chatbot est un composant interactif qui permet aux utilisateurs de communiquer avec l'assistant StoaViva. Il intègre des fonctionnalités avancées de gestion des bases de données Notion et d'interaction avec les modèles Ollama.

## Fonctionnalités

### 1. Interface Utilisateur
- Chat flottant avec bouton de toggle
- Indicateur de statut Notion
- Sélecteur de modèle Ollama avec persistance du choix
- Barre d'outils avec actions rapides
- Zone de messages avec support pour texte, fichiers et images
- Barre de saisie avec bouton d'envoi

### 2. Gestion des Modèles Ollama

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

#### Exemple d'utilisation
```typescript
// Changer de modèle
setSelectedModel('mistral:7b');

// Récupérer les modèles disponibles
const availableModels = await fetch('/api/ollama/models');

### 3. Modes de Chat

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

### 4. Gestion des Fichiers et Images

#### Formats Supportés
- Documents : .txt, .pdf, .doc, .docx
- Images : .jpg, .jpeg, .png, .gif

#### Fonctionnalités
- Téléversement avec barre de progression
- Analyse automatique du contenu
- Extraction d'informations clés
- Questions/réponses sur le document

#### Exemple d'Utilisation
```typescript
// Téléverser un fichier
const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
await handleFileUpload(file);

// Téléverser une image
const image = new File(['content'], 'image.png', { type: 'image/png' });
await handleFileUpload(image);
```

### 5. Commandes Notion

#### Gestion des Bases de Données
```
notion databases                    # Liste toutes les bases de données
notion databases schema <id>        # Affiche le schéma d'une base
notion create database <id> <titre> # Crée une nouvelle base
notion add property <id> <nom> <type> # Ajoute une propriété
notion remove property <id> <nom>   # Supprime une propriété
```

#### Accès aux Données
```
notion produits   # Liste des produits
notion services   # Liste des services
notion personnes  # Liste des clients
notion impact     # Impacts écologiques
notion calendrier # Accès aux événements
```

#### Gestion du Calendrier
- Création/modification/suppression d'événements
- Rappels et notifications
- Synchronisation avec Notion
- Filtrage par date et catégorie

#### Exemple d'Utilisation
```typescript
// Créer un événement
await createEvent({
  title: 'Réunion produit',
  date: '2024-01-15',
  duration: 60,
  participants: ['client@example.com']
});

// Lister les événements
const events = await listEvents({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### 3. Types de Propriétés Supportés
- `title` : Titre (unique par base)
- `rich_text` : Texte enrichi
- `number` : Valeur numérique
- `select` : Sélection unique
- `multi_select` : Sélection multiple
- `date` : Date/heure
- `email` : Email
- `phone_number` : Téléphone

## Utilisation

### Installation
```tsx
import Chatbot from '@/components/Chatbot';

function App() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}
```

### Exemples de Commandes

#### Créer une Base de Données
```
notion create database abc123 "Catalogue Produits"
```
Résultat : Crée une nouvelle base avec les propriétés par défaut (Name, Description)

#### Ajouter des Propriétés
```
notion add property abc123 Prix number
notion add property abc123 Catégorie select
```
Résultat : Ajoute des propriétés à la base existante

#### Voir le Schéma
```
notion databases schema abc123
```
Résultat : Affiche toutes les propriétés de la base

## Tests Unitaires

### Bonnes Pratiques de Test
1. **Isolation des Tests** : Chaque test doit être indépendant et ne pas dépendre de l'état d'autres tests
2. **Nommage Clair** : Les noms des tests doivent décrire clairement leur comportement attendu
3. **Couverture Maximale** : Viser à couvrir tous les cas d'utilisation et edge cases
4. **Tests Déterministes** : Les tests doivent produire le même résultat à chaque exécution
5. **Mocking Approprié** : Utiliser des mocks pour les dépendances externes et les appels API

### Patterns de Test
1. **Arrange-Act-Assert (AAA)** : 
   - Arrange : Préparer l'environnement de test
   - Act : Exécuter l'action à tester
   - Assert : Vérifier le résultat attendu

2. **Given-When-Then** :
   - Given : Définir l'état initial
   - When : Décrire l'action
   - Then : Spécifier le résultat attendu

3. **Test Pyramid** :
   - Beaucoup de tests unitaires
   - Moins de tests d'intégration
   - Encore moins de tests end-to-end

### Outils de Test
1. **Jest** : Framework de test JavaScript
   - Assertions puissantes
   - Mocking intégré
   - Couverture de code

2. **React Testing Library** : 
   - Tests centrés sur l'utilisateur
   - Sélection d'éléments par rôle
   - Simulation d'interactions utilisateur

3. **MSW (Mock Service Worker)** :
   - Interception des requêtes HTTP
   - Simulation d'API
   - Tests plus réalistes

4. **Cypress** (pour les tests E2E) :
   - Tests dans un vrai navigateur
   - Débogage facile
   - Screenshots et vidéos

```typescript
describe('Chatbot', () => {
  it('should process notion database commands', async () => {
    const { getByPlaceholderText, getByText } = render(<Chatbot />);
    const input = getByPlaceholderText('Posez votre question...');
    
    fireEvent.change(input, { 
      target: { value: 'notion databases' } 
    });
    fireEvent.click(getByText('Envoyer'));

    await waitFor(() => {
      expect(getByText(/Bases de données disponibles/)).toBeInTheDocument();
    });
  });

  it('should handle database creation', async () => {
    const { getByPlaceholderText, getByText } = render(<Chatbot />);
    const input = getByPlaceholderText('Posez votre question...');
    
    fireEvent.change(input, { 
      target: { value: 'notion create database abc123 "Test DB"' } 
    });
    fireEvent.click(getByText('Envoyer'));

    await waitFor(() => {
      expect(getByText(/Base de données créée/)).toBeInTheDocument();
    });
  });

  it('should handle calendar event creation', async () => {
    const { getByPlaceholderText, getByText } = render(<Chatbot />);
    const input = getByPlaceholderText('Posez votre question...');
    
    fireEvent.change(input, { 
      target: { value: 'notion create event "Réunion" "2024-01-15"' } 
    });
    fireEvent.click(getByText('Envoyer'));

    await waitFor(() => {
      expect(getByText(/Événement créé/)).toBeInTheDocument();
    });
  });

  it('should handle file upload', async () => {
    const { getByLabelText, getByText } = render(<Chatbot />);
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(getByLabelText('Téléverser un fichier'), {
      target: { files: [file] }
    });

    await waitFor(() => {
      expect(getByText(/Fichier téléversé/)).toBeInTheDocument();
    });
  });

  it('should handle image analysis', async () => {
    const { getByLabelText, getByText } = render(<Chatbot />);
    const image = new File(['test content'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(getByLabelText('Téléverser une image'), {
      target: { files: [image] }
    });

    await waitFor(() => {
      expect(getByText(/Analyse d'image terminée/)).toBeInTheDocument();
    });
  });
});
```

## Gestion des Erreurs

Le composant gère plusieurs types d'erreurs :

1. **Erreurs de Syntaxe**
   - Format de commande invalide
   - Paramètres manquants
   - Types de propriétés non supportés

2. **Erreurs Notion**
   - Base de données non trouvée
   - Permissions insuffisantes
   - Limite d'API dépassée

3. **Erreurs de Validation**
   - ID de base de données invalide
   - Nom de propriété déjà utilisé
   - Type de propriété incompatible

## Bonnes Pratiques

1. **Validation des Entrées**
   - Vérifier les ID de base de données
   - Valider les noms de propriétés
   - Confirmer les types supportés

2. **Gestion du Cache**
   - Mettre en cache les résultats des requêtes
   - Invalider le cache après modifications
   - Limiter les appels API redondants

3. **Feedback Utilisateur**
   - Messages d'erreur clairs
   - Confirmation des actions
   - Indicateurs de chargement

## Personnalisation

Le composant peut être personnalisé via des props :

```typescript
interface ChatbotProps {
  defaultModel?: string;      // Modèle Ollama par défaut
  theme?: 'light' | 'dark';   // Thème visuel
  position?: 'left' | 'right'; // Position du chat
  autoOpen?: boolean;         // Ouverture automatique
  maxHeight?: number;         // Hauteur maximale
}
```

## Dépendances

- `@notionhq/client` : Client API Notion
- `@modelcontextprotocol/sdk` : SDK MCP pour Ollama
- `react` : Framework UI
- `tailwindcss` : Styling

## Limitations Connues

1. Une seule base de données peut être créée à la fois
2. Certains types de propriétés avancés ne sont pas supportés
3. Les modifications de schéma sont irréversibles
4. Les bases de données parentes doivent être accessibles

## Roadmap

- [ ] Support pour plus de types de propriétés
- [ ] Annulation/rétablissement des modifications
- [ ] Interface visuelle pour la création de bases
- [ ] Export/import de schémas
- [ ] Gestion des relations entre bases
