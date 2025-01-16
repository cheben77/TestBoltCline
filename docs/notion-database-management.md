# Gestion des Bases de Données Notion

Ce document décrit les fonctionnalités de gestion des bases de données Notion disponibles dans l'application StoaViva.

## Commandes du Chatbot

### Visualisation des Bases de Données

- `notion databases` : Affiche la liste complète des bases de données avec leurs propriétés
- `notion databases schema <database_id>` : Affiche le schéma détaillé d'une base de données spécifique

### Création et Modification

- `notion create database <parent_page_id> <title>` : Crée une nouvelle base de données
  - Exemple : `notion create database abc123 "Ma Base de Données"`
  - Propriétés par défaut : Name (title), Description (rich_text)

- `notion add property <database_id> <property_name> <property_type>` : Ajoute une nouvelle propriété
  - Exemple : `notion add property abc123 Prix number`

- `notion remove property <database_id> <property_name>` : Supprime une propriété existante
  - Exemple : `notion remove property abc123 Prix`

## Types de Propriétés Supportés

- `title` : Titre de la page (une seule propriété title par base)
- `rich_text` : Texte enrichi avec formatage
- `number` : Valeur numérique
- `select` : Sélection unique parmi une liste d'options
- `multi_select` : Sélection multiple parmi une liste d'options
- `date` : Date et/ou heure
- `email` : Adresse email
- `phone_number` : Numéro de téléphone

## Service Notion (notionService)

Le service Notion expose plusieurs méthodes pour gérer les bases de données :

### getDatabases()
```typescript
async getDatabases(): Promise<Array<{name: string; id: string; properties: any}>>
```
Retourne la liste de toutes les bases de données accessibles avec leurs propriétés.

### createDatabase()
```typescript
async createDatabase(params: {
  parent_page_id: string;
  title: string;
  properties: Record<string, any>;
}): Promise<any>
```
Crée une nouvelle base de données avec les propriétés spécifiées.

### getDatabaseSchema()
```typescript
async getDatabaseSchema(database_id: string): Promise<any>
```
Récupère le schéma complet d'une base de données.

### addDatabaseProperty()
```typescript
async addDatabaseProperty(params: {
  database_id: string;
  property_name: string;
  property_config: any;
}): Promise<any>
```
Ajoute une nouvelle propriété à une base de données existante.

### removeDatabaseProperty()
```typescript
async removeDatabaseProperty(params: {
  database_id: string;
  property_name: string;
}): Promise<any>
```
Supprime une propriété d'une base de données.

## Exemples d'Utilisation

### Créer une Base de Données de Produits
```
notion create database abc123 "Catalogue Produits"
notion add property abc123 Prix number
notion add property abc123 Catégorie select
notion add property abc123 Tags multi_select
```

### Modifier une Base de Données Existante
```
notion databases schema abc123
notion add property abc123 DateAjout date
notion remove property abc123 Tags
```

## Cache et Performances

- Les résultats des requêtes sont mis en cache pendant 5 minutes
- Le cache est automatiquement invalidé lors des modifications
- En mode développement, des données mockées sont utilisées

## Gestion des Erreurs

Le service gère plusieurs types d'erreurs :
- Clé API manquante ou invalide
- Base de données inexistante
- Propriété invalide ou en doublon
- Erreurs de connexion à l'API Notion

Les erreurs sont loggées dans la console et remontées à l'utilisateur via le chatbot avec des messages explicatifs.
