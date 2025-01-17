# Guide d'Automatisation Stoaviva

Ce guide explique comment utiliser les différents outils d'automatisation intégrés dans le canevas.

## Table des Matières

1. [Prérequis et Installation](#prérequis-et-installation)
   - [Intégration Windows](#intégration-windows)
   - [Dépendances Système](#dépendances-système)
   - [Installation](#installation)
   - [Vérification](#vérification)

2. [Triggers Natifs](#triggers-natifs)
   - [Informations Système](#1-informations-système)
   - [Flux Caméra](#2-flux-caméra)
   - [Effets Vidéo](#3-effets-vidéo)
   - [Détection de Mouvement](#4-détection-de-mouvement)
   - [Détection de Visage](#5-détection-de-visage)
   - [Scanner QR Code](#6-scanner-qr-code)

3. [Templates d'Automatisation](#templates-dautomatisation)
   - [Task Scheduler Windows](#1-task-scheduler-windows)
   - [Power Automate Desktop](#2-power-automate-desktop)
   - [AutoHotkey](#3-autohotkey)
   - [Planificateur Python](#4-planificateur-python)
   - [Backup Automatique](#5-backup-automatique)
   - [Rapports Automatiques](#6-rapports-automatiques)

4. [Interface du Canevas](#interface-du-canevas)
   - [Raccourcis Clavier](#raccourcis-clavier)
   - [Personnalisation](#personnalisation)
   - [Zone Principale](#zone-principale)
   - [Panneau Latéral](#panneau-latéral)

5. [Workflows](#workflows)
   - [Création](#création)
   - [Exécution](#exécution)
   - [Utilisation](#utilisation)

6. [Intégration Notion](#intégration-notion)
   - [Synchronisation](#synchronisation)
   - [Templates](#templates)
   - [Gestion](#gestion)

7. [Débogage et Résolution](#débogage-et-résolution-de-problèmes)
   - [Outils de Débogage](#outils-de-débogage)
   - [Problèmes Courants](#problèmes-courants)

8. [Exemples et Cas d'Utilisation](#exemples-et-cas-dutilisation)
   - [Automatisation de Bureau](#automatisation-de-bureau)
   - [Automatisation Web](#automatisation-web)
   - [Intégration d'Applications](#intégration-dapplications)

9. [Bonnes Pratiques](#bonnes-pratiques)
   - [Sécurité](#sécurité)
   - [Maintenance](#maintenance)
   - [Performance](#performance)

10. [Ressources et Support](#ressources-et-support)
    - [Documentation Complémentaire](#documentation-complémentaire)
    - [Support Technique](#support-technique)
    - [Formation](#formation)


## Prérequis et Installation

### Intégration Windows
1. **Power Automate Desktop**
   - Installation via Microsoft Store
   - Configuration du compte Microsoft
   - Activation des connecteurs système

2. **Planificateur de tâches**
   - Activation des permissions administrateur
   - Configuration des déclencheurs système
   - Accès aux journaux d'événements

3. **Permissions requises**
   - Exécution de scripts
   - Accès système
   - Contrôle des applications

### Dépendances Système
- **Windows 11** ou supérieur
- **Python 3.8+** pour les scripts Python
- **Node.js 18+** pour l'interface
- **AutoHotkey v2** pour les raccourcis
- **Power Automate Desktop** pour les flux

### Installation
1. **Outils Windows**
   ```bash
   # Installation d'AutoHotkey
   winget install AutoHotkey.AutoHotkey

   # Installation de Power Automate Desktop
   winget install Microsoft.PowerAutomate
   ```

2. **Bibliothèques Python**
   ```bash
   pip install schedule
   pip install pywin32
   pip install python-dotenv
   ```

3. **Configuration**
   - Créez un fichier `.env` pour les variables d'environnement
   - Configurez les permissions Windows nécessaires
   - Vérifiez l'accès aux API requises

### Vérification
1. Testez les commandes de base
2. Vérifiez les connexions API
3. Validez les permissions

## Triggers Natifs

### 1. Informations Système
- **ID**: system-info
- **Description**: Récupère les informations système
- **Options**: cpu, memory, battery, network, storage
- **Utilisation**: Surveillance des ressources système

### 2. Flux Caméra
- **ID**: camera-stream
- **Description**: Gère le flux vidéo de la caméra
- **Modes**: photo, video, stream
- **Caméras**: user (frontale), environment (arrière)
- **Qualités**: low, medium, high, 4k

### 3. Effets Vidéo
- **ID**: video-effects
- **Description**: Applique des effets au flux vidéo
- **Effets**: blur, grayscale, sepia, invert, custom
- **Paramètres**: intensité (0-100), filtre personnalisé

### 4. Détection de Mouvement
- **ID**: motion-detection
- **Description**: Détecte les mouvements dans le flux vidéo
- **Paramètres**: 
  - Sensibilité (1-100)
  - Région de détection (x,y,w,h)

### 5. Détection de Visage
- **ID**: face-detection
- **Description**: Détecte les visages dans l'image
- **Modes**: single, multiple, landmarks
- **Paramètres**: taille minimum du visage

### 6. Scanner QR Code
- **ID**: qr-scanner
- **Description**: Scanne les QR codes via la caméra
- **Modes**: single, continuous
- **Formats**: qr, barcode, all

## Templates d'Automatisation

## 1. Task Scheduler Windows

Permet de créer et gérer des tâches planifiées Windows via l'interface schtasks.

### Fonctionnalités
- Création de tâches avec planification flexible
- Suppression de tâches existantes
- Liste des tâches planifiées

### Exemple d'utilisation
```python
# Créer une tâche quotidienne
create_task(
    name="MaTacheQuotidienne",
    script_path="mon_script.py",
    schedule="/sc DAILY /st 09:00"
)
```

## 2. Power Automate Desktop

Intégration avec Power Automate Desktop pour créer des flux automatisés.

### Fonctionnalités
- Création de flux via l'API COM
- Actions système prédéfinies
- Exécution de flux

### Exemple d'utilisation
```python
# Créer un flux de copie de fichiers
actions = [
    {
        "type": "System.File.Copy",
        "parameters": {
            "sourcePath": "C:\\source",
            "destinationPath": "C:\\destination"
        }
    }
]
create_power_automate_flow("MonFlux", actions)
```

## 3. AutoHotkey

Création de raccourcis clavier et automatisation Windows.

### Raccourcis disponibles
- Win+1 : Gestionnaire des tâches
- Win+2 : Bloc-notes
- Ctrl+Alt+T : Terminal
- Win+` : Fenêtre toujours visible
- Win+C : Copier le chemin
- Win+E : Explorateur personnalisé
- Win+PgUp/PgDn : Volume
- Win+S : Capture d'écran

### Exemple de personnalisation
```autohotkey
; Ajouter un raccourci personnalisé
#n::Run notepad.exe

; Remplacer du texte
::email::votre.email@domaine.com
```

## 4. Planificateur Python

Planification de tâches Python avec la bibliothèque schedule.

### Fonctionnalités
- Tâches récurrentes
- Intervalles personnalisables
- Logging intégré

### Exemple d'utilisation
```python
import schedule

# Tâche toutes les heures
schedule.every().hour.do(job)

# Tâche quotidienne à 9h
schedule.every().day.at("09:00").do(job)
```

## 5. Backup Automatique

Sauvegarde automatisée de fichiers et dossiers.

### Fonctionnalités
- Backup daté
- Copie récursive
- Gestion des erreurs

### Exemple d'utilisation
```python
backup_files(
    source_dir="documents",
    backup_dir="backups"
)
```

## 6. Rapports Automatiques

Envoi automatisé de rapports par email.

### Fonctionnalités
- Envoi via SMTP
- Support HTML/Plain text
- Pièces jointes

### Exemple d'utilisation
```python
send_email_report(
    sender="votre@email.com",
    receiver="destinataire@email.com",
    subject="Rapport quotidien",
    body="Contenu du rapport"
)
```

## Interface du Canevas

### Raccourcis Clavier
- **Généraux**
  - Ctrl+S : Sauvegarder
  - Ctrl+Z : Annuler
  - Ctrl+Y : Rétablir
  - Ctrl+F : Rechercher
  - Ctrl+H : Remplacer
  - Ctrl+W : Fermer

- **Édition**
  - Ctrl+X/C/V : Couper/Copier/Coller
  - Ctrl+A : Sélectionner tout
  - Ctrl+D : Dupliquer la ligne
  - Ctrl+/ : Commenter/Décommenter
  - Alt+↑/↓ : Déplacer la ligne
  - Tab/Shift+Tab : Indenter/Désindenter

- **Code**
  - Ctrl+Space : Auto-complétion
  - Ctrl+B : Formater le code
  - F5 : Exécuter
  - F9 : Point d'arrêt
  - F12 : Aller à la définition

### Personnalisation
- **Apparence**
  - Thème : Clair/Sombre
  - Police : Taille et famille
  - Indentation : Espaces/Tabs
  - Coloration : Syntaxe personnalisée

- **Éditeur**
  - Auto-save : Délai configurable
  - Wrap : Retour à la ligne
  - Minimap : Affichage/Position
  - Règles : Guides visuels

- **Snippets**
  - Templates personnels
  - Raccourcis personnalisés
  - Import/Export
  - Synchronisation Notion

### Zone Principale
1. **Éditeur**
   - Zone de code principale
   - Coloration syntaxique
   - Auto-complétion
   - Numéros de ligne
   - Suggestions contextuelles
   - Validation en temps réel

2. **Prévisualisation**
   - Rendu en temps réel
   - Support multi-langages
   - Formatage automatique
   - Détection d'erreurs
   - Aide contextuelle :
     * Suggestions de paramètres
     * Documentation intégrée
     * Exemples interactifs
     * Débogage en direct

3. **Aide à la Saisie**
   - Suggestions de code
   - Documentation API
   - Exemples de templates
   - Validation de syntaxe
   - Complétion intelligente :
     * Variables disponibles
     * Fonctions système
     * Paramètres attendus
     * Types de données

3. **Barre d'Outils**
   - Sélection du langage
   - Synchronisation Notion
   - Gestion des workflows
   - Fermeture du canevas

### Panneau Latéral
1. **Triggers Natifs**
   - Accès rapide aux triggers
   - Icônes intuitives
   - Description au survol
   - Configuration des paramètres

2. **Templates**
   - Templates prédéfinis
   - Sauvegarde personnalisée
   - Organisation par catégorie
   - Gestion (ajout/suppression)

## Workflows

### Création
1. Cliquez sur "Créer Workflow"
2. Sélectionnez les triggers à utiliser
3. Configurez chaque étape :
   - Paramètres spécifiques
   - Conditions d'exécution
   - Ordre des opérations
4. Nommez et sauvegardez le workflow

### Exécution
1. Sélectionnez un workflow existant
2. Vérifiez les paramètres
3. Cliquez sur "Exécuter"
4. Suivez la progression :
   - Logs en temps réel
   - Résultats dans l'éditeur
   - Gestion des erreurs

### Utilisation
1. Sélectionnez l'outil via son icône
2. Le template s'affiche dans l'éditeur
3. Personnalisez selon vos besoins
4. Sauvegardez si nécessaire
5. Exécutez l'automatisation

## Intégration Notion

### Synchronisation
1. **Configuration**
   - Entrez l'ID de la base Notion
   - Vérifiez les permissions
   - Configurez les mappings

2. **Templates**
   - Synchronisation bidirectionnelle
   - Versionnage automatique
   - Partage d'équipe

3. **Gestion**
   - Import/Export de templates
   - Organisation par catégories
   - Historique des modifications

## Débogage et Résolution de Problèmes

### Outils de Débogage
1. **Console intégrée**
   - Logs en temps réel
   - Filtrage par niveau
   - Export des logs
   - Recherche avancée

2. **Points d'arrêt**
   - Breakpoints conditionnels
   - Inspection des variables
   - Pile d'appels
   - Modification à chaud

3. **Inspecteur de Variables**
   - Valeurs en temps réel
   - Historique des modifications
   - Expressions de surveillance
   - Évaluation d'expressions

### Problèmes Courants
1. **Permissions**
   - Vérifiez les droits administrateur
   - Validez les accès système
   - Contrôlez les pare-feu
   - Testez les connexions

2. **Intégration**
   - Validez les API keys
   - Testez les endpoints
   - Vérifiez les versions
   - Synchronisez les données

3. **Performance**
   - Optimisez les boucles
   - Gérez la mémoire
   - Limitez les appels API
   - Utilisez le cache

## Exemples et Cas d'Utilisation

### Automatisation de Bureau
1. **Gestion de Fichiers**
   ```python
   # Tri automatique des téléchargements
   def sort_downloads():
       extensions = {
           'images': ['.jpg', '.png', '.gif'],
           'documents': ['.pdf', '.doc', '.xlsx'],
           'archives': ['.zip', '.rar', '.7z']
       }
       # Code de tri...
   ```

2. **Sauvegarde Périodique**
   ```python
   # Backup quotidien à minuit
   schedule.every().day.at("00:00").do(backup_files,
       source="Documents",
       destination="D:/Backups"
   )
   ```

3. **Surveillance Système**
   ```python
   # Alerte si CPU > 90%
   def monitor_cpu():
       if psutil.cpu_percent() > 90:
           send_alert("CPU élevé !")
   ```

### Automatisation Web
1. **Capture de Données**
   ```python
   # Extraction de prix
   def track_prices():
       prices = []
       for product in products:
           price = get_price(product.url)
           prices.append(price)
   ```

2. **Remplissage de Formulaires**
   ```python
   # Soumission automatique
   def submit_form(data):
       browser.fill("name", data.name)
       browser.fill("email", data.email)
       browser.click("submit")
   ```

### Intégration d'Applications
1. **Synchronisation**
   ```python
   # Sync Notion-Calendar
   def sync_tasks():
       notion_tasks = get_notion_tasks()
       for task in notion_tasks:
           add_to_calendar(task)
   ```

2. **Notifications**
   ```python
   # Alertes Teams
   def send_team_alert(message):
       teams_webhook.send(message)
   ```

## Bonnes Pratiques

1. **Sécurité**
   - Ne stockez pas de mots de passe en clair
   - Utilisez des variables d'environnement
   - Testez dans un environnement sécurisé
   - Chiffrez les données sensibles

2. **Maintenance**
   - Commentez votre code
   - Utilisez des noms explicites
   - Gérez les erreurs

3. **Performance**
   - Évitez les boucles infinies
   - Libérez les ressources
   - Utilisez des timeouts appropriés

## Ressources et Support

### Documentation Complémentaire
1. **Guides Officiels**
   - [Documentation Windows](https://docs.microsoft.com/windows)
   - [Power Automate](https://docs.microsoft.com/power-automate)
   - [AutoHotkey](https://www.autohotkey.com/docs)
   - [Python Schedule](https://schedule.readthedocs.io)

2. **Tutoriels**
   - Premiers pas avec l'automatisation
   - Création de workflows avancés
   - Intégration avec Notion
   - Débogage et optimisation

### Support Technique
1. **Dépannage**
   - FAQ et solutions communes
   - Guide de résolution
   - Diagnostics système
   - Logs et rapports

2. **Communauté**
   - Forum d'entraide
   - Base de connaissances
   - Exemples de la communauté
   - Mises à jour et nouveautés

### Formation
1. **Tutoriels Vidéo**
   - Installation et configuration
   - Création de workflows
   - Automatisation avancée
   - Cas pratiques

2. **Ateliers**
   - Sessions en direct
   - Démonstrations
   - Questions/Réponses
   - Partage d'expérience
