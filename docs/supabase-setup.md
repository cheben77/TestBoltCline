# Configuration Supabase

## Installation

1. Créer un projet sur [Supabase](https://app.supabase.com)
2. Noter les informations de connexion :
   - URL du projet
   - Clé anon/public
   - Clé service_role (pour les migrations)

## Configuration Locale

1. Copier le fichier d'exemple des variables d'environnement :
```bash
cp .env.local.example .env.local
```

2. Remplir les variables dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Structure de la Base de Données

### Tables Principales

1. **chat_sessions**
   - Stocke les sessions de chat
   - Lié à un utilisateur
   - Métadonnées flexibles en JSON

2. **chat_messages**
   - Messages de l'utilisateur et de l'assistant
   - Lié à une session
   - Horodatage pour l'historique

3. **chat_contexts**
   - Contexte additionnel (Notion, fichiers)
   - Enrichit la conversation
   - Format JSON flexible

### Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Politiques d'accès basées sur l'utilisateur
- Nettoyage automatique des anciennes sessions

## Migrations

Les migrations sont dans `supabase/migrations/` :

```sql
-- Exemple de création d'une nouvelle migration
supabase migration new nom_de_la_migration

-- Application des migrations
supabase db reset
```

## Row Level Security (RLS)

Les politiques garantissent que :
- Les utilisateurs ne voient que leurs propres données
- Les sessions sont automatiquement liées à l'utilisateur
- Les messages sont sécurisés via la session

## Maintenance

### Nettoyage Automatique

```sql
-- Nettoyer les sessions de plus de 30 jours
SELECT cleanup_old_chat_sessions(30);
```

### Monitoring

1. Vérifier l'utilisation :
```sql
SELECT count(*), date_trunc('day', created_at) as day
FROM chat_messages
GROUP BY day
ORDER BY day DESC;
```

2. Taille des tables :
```sql
SELECT pg_size_pretty(pg_total_relation_size('chat_messages'));
```

## Développement

### Types TypeScript

Les types sont générés depuis la base de données :

```bash
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

### Tests

```bash
# Lancer les tests avec la base de données de test
npm run test:integration
```

## Bonnes Pratiques

1. **Sécurité**
   - Ne jamais exposer la clé service_role
   - Toujours utiliser RLS
   - Valider les entrées côté serveur

2. **Performance**
   - Indexer les colonnes fréquemment utilisées
   - Nettoyer régulièrement les anciennes données
   - Utiliser des vues matérialisées si nécessaire

3. **Maintenance**
   - Sauvegarder régulièrement
   - Monitorer l'utilisation
   - Mettre à jour les extensions

## Dépannage

### Problèmes Courants

1. **Erreur de connexion**
   - Vérifier les variables d'environnement
   - Tester avec `supabase status`

2. **Erreurs RLS**
   - Vérifier les politiques
   - Utiliser `auth.uid()` dans les requêtes

3. **Performance**
   - Analyser avec `EXPLAIN ANALYZE`
   - Vérifier les index manquants

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Exemples de Politiques](https://supabase.com/docs/guides/auth/row-level-security#policies)
