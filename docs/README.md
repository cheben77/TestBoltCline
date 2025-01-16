# Documentation Technique StoaViva

## Introduction
Ce repository contient la documentation technique complète du projet StoaViva, une plateforme combinant une boutique en ligne de produits écologiques et des services à la personne.

## Structure des Documents

### Architecture
- [Architecture Technique](architecture.md) : Vue d'ensemble de l'architecture technique
- [Intégration Notion](notion-setup.md) : Configuration et utilisation de Notion
- [Gestion des Bases de Données Notion](notion-database-management.md) : Commandes et API pour gérer les bases Notion
- [Intégration Ollama](notion-ollama-integration.md) : Utilisation des modèles de langage

### Composants
- [ProductCard](ProductCard.md) : Documentation du composant ProductCard
- [PersonsList](components.md#personslist) : Documentation du composant PersonsList
- [EcoImpactChart](components.md#ecoimpactchart) : Documentation du composant EcoImpactChart
- [Chatbot](components.md#chatbot) : Documentation du composant Chatbot
- [KitPreferencesForm](components.md#kitpreferencesform) : Documentation du composant KitPreferencesForm

### Services
- [Services Techniques](services.md) : Documentation des services techniques
- [Notion](services.md#notion) : Intégration avec Notion API
- [Ollama](services.md#ollama) : Utilisation des modèles de langage
- [PersonService](services.md#personservice) : Gestion des données utilisateurs
- [Checklist Services](services-checklist.md) : Checklist des services à implémenter

### Pages
- [Page d'Accueil](home-page.md) : Documentation de la page d'accueil
- [Page Produits](produits-page.md) : Documentation de la page produits

### Styles
- [Styles Globaux](global-styles.md) : Documentation des styles globaux

### Roadmap
- [Prochaines Étapes](next-steps.md) : Roadmap technique et fonctionnelle

## Comment Contribuer
1. Cloner le repository
2. Créer une nouvelle branche pour vos modifications
3. Mettre à jour la documentation correspondante
4. Soumettre une pull request

## Conventions
- Utiliser Markdown pour la rédaction
- Maintenir une structure claire et cohérente
- Inclure des exemples de code quand nécessaire
- Mettre à jour les documents liés lors des modifications

## Outils Utilisés
- **Next.js** : Framework React pour le frontend et backend
- **Tailwind CSS** : Framework CSS pour le styling
- **Notion** : Base de données et gestion de contenu
- **Ollama** : Modèles de langage pour les fonctionnalités IA
- **Vercel** : Plateforme de déploiement et hosting
- **PostgreSQL** : Base de données relationnelle
- **Prisma** : ORM pour la gestion des données

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
