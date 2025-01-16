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

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

MIT
