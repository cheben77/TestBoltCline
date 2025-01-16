 du# Configuration de l'Intégration Notion (Lecture Seule)

Ce guide explique comment configurer l'intégration Notion en lecture seule pour StoaViva.

## Prérequis

1. Un compte Notion
2. Une intégration Notion créée sur https://www.notion.so/my-integrations

## Configuration de l'Intégration

1. Créez une nouvelle intégration sur https://www.notion.so/my-integrations
   - Nom : "StoaViva Integration"
   - Logo : Utilisez le logo StoaViva
   - Capabilities requises :
     - Read content
     - Update content
     - Insert content
     - Create databases
     - Update databases

2. Copiez la clé d'API (commence par "ntn_")

3. Créez un fichier `.env.local` à la racine du projet avec :
   ```env
   NOTION_API_KEY=votre_clé_api_notion
   NOTION_PUBLICS_DB_ID=177151e8ba2980fcb222cf94852eed78
   NOTION_PARENT_PAGE_ID=votre_page_id_pour_nouvelles_bases
   ```

   Le NOTION_PARENT_PAGE_ID est l'ID de la page où seront créées les nouvelles bases de données.

## Accès aux Bases de Données

1. Ouvrez la base de données "Publics" dans Notion
2. Cliquez sur les ... en haut à droite
3. Sélectionnez "Add connections"
4. Choisissez votre intégration

## Structure des Données

### Base de données "Publics"
La base de données "Publics" doit avoir les propriétés suivantes :
- Name (titre)
- Age (nombre)
- Interests (multi-select)
- Email (email)
- Phone (téléphone)
- Status (select)
- LastContact (date)
- Notes (texte enrichi)

### Types de Propriétés Supportés
Vous pouvez utiliser les types de propriétés suivants lors de la création ou modification des bases de données :

- `title` : Titre de la page (une seule propriété title par base)
- `rich_text` : Texte enrichi avec formatage
- `number` : Valeur numérique (avec formats : euro, pourcentage, etc.)
- `select` : Sélection unique parmi une liste d'options
- `multi_select` : Sélection multiple parmi une liste d'options
- `date` : Date et/ou heure
- `email` : Adresse email
- `phone_number` : Numéro de téléphone
- `checkbox` : Case à cocher
- `url` : Lien URL
- `files` : Fichiers attachés

## Utilisation

### Gestion des Bases de Données

```typescript
import { notionService } from '@/services/notion';

// Lister les bases de données
const databases = await notionService.getDatabases();

// Créer une nouvelle base
const newDb = await notionService.createDatabase({
  parent_page_id: process.env.NOTION_PARENT_PAGE_ID,
  title: 'Nouvelle Base',
  properties: {
    Name: { type: 'title', title: {} },
    Description: { type: 'rich_text', rich_text: {} }
  }
});

// Ajouter une propriété
await notionService.addDatabaseProperty({
  database_id: newDb.id,
  property_name: 'Status',
  property_config: {
    type: 'select',
    select: { options: [
      { name: 'En cours', color: 'blue' },
      { name: 'Terminé', color: 'green' }
    ]}
  }
});

// Voir le schéma d'une base
const schema = await notionService.getDatabaseSchema(newDb.id);
```

### Lecture des Données

```typescript
import { notionService } from '@/services/notion';

// Récupérer toutes les personnes
const persons = await notionService.getPersons();

// Rechercher des personnes
const results = await notionService.searchPersons('query');
```

### Composants React

```typescript
// Liste des personnes avec filtrage
import PersonsList from '@/components/PersonsList';

// Utilisation
<PersonsList />
```

## Dépannage

### Erreurs Courantes


1. **"Could not find database with ID"**
   - Vérifiez que la base de données est partagée avec l'intégration
   - Confirmez que l'ID est correct dans .env.local

2. **"API Rate Limit Exceeded"**
   - Le système de cache devrait empêcher ce problème
   - Si cela persiste, vérifiez les appels API fréquents

3. **"Invalid Request"**
   - Vérifiez le format des données
   - Confirmez que la structure de la base de données n'a pas changé

## Sécurité

1. Ne jamais exposer la clé API
2. Limiter les permissions aux opérations nécessaires
3. Valider toutes les entrées utilisateur avant de les envoyer à l'API
4. Utiliser des variables d'environnement pour les IDs sensibles
5. Suivre les bonnes pratiques de sécurité Notion
6. Mettre en place une gestion des erreurs robuste

## Ressources

- [Documentation Notion API](https://developers.notion.com/)
- [Guide d'Intégration](https://developers.notion.com/docs)
- [Limites API](https://developers.notion.com/reference/request-limits)
- [Guide des Propriétés](https://developers.notion.com/reference/property-object)
- [Guide de Création de Bases](https://developers.notion.com/reference/create-a-database)
- [Gestion des Erreurs](https://developers.notion.com/reference/errors)
