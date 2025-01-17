# Guide de Sauvegarde StoaViva

## Sauvegarde Rapide

Un raccourci "Sauvegarder StoaViva" a été créé sur votre bureau. Pour sauvegarder l'application :

1. Double-cliquez sur le raccourci
2. Attendez que les services s'arrêtent
3. La sauvegarde se fait automatiquement
4. Un message confirmera la fin de la sauvegarde

## Emplacements des Sauvegardes

Les sauvegardes sont stockées dans deux dossiers :

- `backup/stoaviva-latest` : Dernière sauvegarde
- `backup/stoaviva-YYYYMMDD` : Sauvegarde datée (historique)

## Avant de Dormir

1. Terminez votre travail
2. Cliquez sur le raccourci "Sauvegarder StoaViva"
3. Attendez le message de confirmation
4. Fermez votre ordinateur en toute tranquillité

## Restauration

Pour restaurer une sauvegarde :

1. Arrêtez les services (`stop-services.bat`)
2. Copiez le contenu de `backup/stoaviva-latest` (ou d'une sauvegarde datée)
3. Collez dans le dossier du projet
4. Redémarrez les services (`start-services.bat`)

## Notes

- Une sauvegarde est créée chaque jour
- Les anciennes sauvegardes sont conservées
- Le processus est entièrement automatique
- Pas besoin de configuration supplémentaire
