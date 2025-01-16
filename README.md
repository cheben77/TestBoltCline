# StoaViva

Application web pour la gestion de produits et services de bien-être, intégrant Notion comme base de données et un chatbot alimenté par Ollama.

## Fonctionnalités

- 🛍️ Gestion des produits de bien-être
- 📅 Gestion des services et rendez-vous
- 🤖 Chatbot intelligent pour l'assistance client
- 📊 Suivi de l'impact écologique
- 👥 Gestion des clients et préférences
- 🔄 Synchronisation avec Notion

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Notion API
- Ollama
- Jest pour les tests

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/stoaviva.git
cd stoaviva
```

2. Installer les dépendances :
```bash
npm install
```

3. Copier le fichier d'environnement :
```bash
cp .env.local.example .env.local
```

4. Configurer les variables d'environnement dans `.env.local` :
```
NOTION_API_KEY=votre_clé_api_notion
NOTION_PRODUCTS_DB_ID=id_base_produits
NOTION_SERVICES_DB_ID=id_base_services
NOTION_CALENDAR_DB_ID=id_base_calendrier
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du Projet

```
stoaviva/
├── docs/            # Documentation
├── public/          # Fichiers statiques
├── src/
│   ├── app/         # Pages et routes Next.js
│   ├── components/  # Composants React
│   ├── lib/         # Bibliothèques et utilitaires
│   ├── services/    # Services (Notion, Ollama)
│   └── scripts/     # Scripts utilitaires
└── tests/          # Tests
```

## Organisation des Branches

Le projet est organisé en plusieurs branches fonctionnelles :

- `main` : Branche principale, contient le code stable
- `feature/chatbot` : Développement du chatbot avec intégration Ollama
- `feature/products` : Gestion des produits et catalogue
- `feature/services` : Gestion des services et rendez-vous
- `feature/eco-impact` : Suivi et analyse de l'impact écologique
- `feature/clients` : Gestion des clients et préférences

### Workflow de Développement

1. Choisir la branche correspondant à la fonctionnalité :
```bash
git checkout feature/[nom-fonctionnalite]
```

2. Créer une sous-branche pour votre tâche spécifique :
```bash
git checkout -b feature/[nom-fonctionnalite]/[tache-specifique]
```

3. Développer et tester localement :
```bash
npm run dev
npm test
```

4. Commit et push des changements :
```bash
git add .
git commit -m "Description détaillée des changements"
git push origin feature/[nom-fonctionnalite]/[tache-specifique]
```

5. Ouvrir une Pull Request vers la branche fonctionnelle correspondante

### Contribution

1. Fork le projet
2. Choisir ou créer la branche appropriée selon la fonctionnalité
3. Suivre le workflow de développement ci-dessus
4. Ouvrir une Pull Request

## Licence

MIT
