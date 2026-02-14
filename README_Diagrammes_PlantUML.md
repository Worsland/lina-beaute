# 📊 Guide d'Utilisation des Diagrammes PlantUML

## 📋 Fichiers Disponibles

1. **diagramme_cas_utilisation.puml** - Diagramme complet détaillé (recommandé pour documentation)
2. **diagramme_cas_utilisation_simplifie.puml** - Vue d'ensemble simplifiée (recommandé pour présentations)

---

## 🚀 Comment Visualiser les Diagrammes

### Méthode 1 : VS Code (RECOMMANDÉE)

#### Installation Extension
1. Ouvrir VS Code
2. Aller dans Extensions (Ctrl+Shift+X)
3. Rechercher **"PlantUML"** par jebbs
4. Cliquer sur "Install"

#### Visualiser le Diagramme
1. Ouvrir le fichier `.puml` dans VS Code
2. Appuyer sur `Alt+D` (ou clic droit > "Preview Current Diagram")
3. Le diagramme s'affiche dans un panneau à droite

#### Exporter en Image
1. Ouvrir le diagramme en preview
2. Clic droit sur le preview > "Export Current Diagram"
3. Choisir le format :
   - **PNG** (recommandé pour documents)
   - **SVG** (recommandé pour présentations, qualité vectorielle)
   - **PDF**

### Méthode 2 : En Ligne (PlantUML Online)

1. Aller sur : https://www.plantuml.com/plantuml/uml/
2. Copier tout le contenu du fichier `.puml`
3. Coller dans l'éditeur
4. Le diagramme s'affiche automatiquement
5. Télécharger avec les boutons PNG/SVG/TXT

### Méthode 3 : IntelliJ IDEA / PyCharm

1. Installer le plugin PlantUML
2. Ouvrir le fichier `.puml`
3. Le diagramme s'affiche automatiquement dans un panneau

### Méthode 4 : Ligne de Commande (Java requis)

```bash
# Télécharger PlantUML JAR
curl -L -o plantuml.jar https://sourceforge.net/projects/plantuml/files/plantuml.jar/download

# Générer PNG
java -jar plantuml.jar diagramme_cas_utilisation.puml

# Générer SVG
java -jar plantuml.jar -tsvg diagramme_cas_utilisation.puml

# Générer PDF
java -jar plantuml.jar -tpdf diagramme_cas_utilisation.puml
```

---

## 📖 Structure du Diagramme Complet

### Packages Principaux

#### 1. 🔐 Gestion des Comptes
- Inscription, connexion, profil
- **Acteurs** : Cliente, Établissement

#### 2. 🔍 Recherche et Découverte
- Recherche de services
- Consultation des établissements
- **Fonctionnalité clé** : Assistant IA

#### 3. 📅 Gestion des Réservations Cliente
- Création, modification, annulation
- Rappels automatiques
- **Acteurs** : Cliente

#### 4. ⭐ Avis et Évaluations
- Notes et commentaires
- Gestion des avis
- **Acteurs** : Cliente, Établissement

#### 5. 🤖 Intelligence Artificielle
- Analyse NLP
- Recommandations
- Automatisation
- **Acteur** : Assistant IA

#### 6. 🏢 Gestion Établissement
- Profil et informations
- Catalogue de services
- **Acteurs** : Établissement

#### 7. 📋 Gestion Réservations Établissement
- Calendrier et planning
- Gestion des créneaux
- **Acteurs** : Établissement, Praticienne

#### 8. 👥 Gestion de l'Équipe
- Ajout de praticiennes
- Plannings individuels
- **Acteurs** : Établissement

#### 9. ⏰ Gestion des Disponibilités
- Configuration des créneaux
- Fermetures exceptionnelles
- **Acteurs** : Établissement

#### 10. 👤 Gestion Clientèle
- Base de données clients
- Historique et notes
- **Acteurs** : Établissement

#### 11. 📊 Statistiques et Rapports
- Dashboard KPIs
- Analyses de performance
- **Acteurs** : Établissement

#### 12. 📢 Marketing et Communication
- Promotions
- Newsletters et SMS
- **Acteurs** : Établissement

#### 13. ⚙️ Administration Plateforme
- Validation établissements
- Modération contenu
- Configuration globale
- **Acteurs** : Super Admin

#### 14. 🔔 Système de Notifications
- Emails, SMS, notifications in-app
- **Acteur système** : Service de notification

---

## 🎨 Légende des Couleurs

### Diagramme Complet

| Couleur | Signification |
|---------|---------------|
| 🌸 Rose clair | Cas d'utilisation **Core** (fonctionnalités essentielles) |
| 💜 Lavande | Cas d'utilisation **IA** (intelligence artificielle) |
| 💛 Jaune | Cas d'utilisation **Admin** (administration) |
| ⚪ Gris | Cas d'utilisation standards |

### Acteurs

| Couleur | Acteur |
|---------|--------|
| 🩷 Rose | Cliente |
| 💙 Bleu | Établissement |
| 💛 Jaune | Super Admin |

---

## 🔗 Types de Relations

| Symbole | Relation | Signification |
|---------|----------|---------------|
| `-->` | Association | L'acteur utilise le cas d'utilisation |
| `.>` | Include | Le cas A inclut obligatoirement le cas B |
| `..>` | Extend | Le cas A peut être étendu par le cas B (optionnel) |
| `<\|--` | Héritage | L'acteur hérite des permissions d'un autre |

### Exemples

```
cliente --> UC_CREATE_BOOKING
// La cliente utilise la fonctionnalité de création de réservation

UC_CREATE_BOOKING .> UC_SELECT_SERVICES : <<include>>
// Créer une réservation INCLUT obligatoirement la sélection de services

UC_SEARCH ..> UC_USE_AI : <<extend>>
// La recherche PEUT être étendue par l'utilisation de l'IA (optionnel)

visiteur <|-- cliente
// La cliente hérite des permissions du visiteur
```

---

## 📝 Personnalisation

### Modifier les Couleurs

Chercher la section `skinparam usecase` et modifier :

```plantuml
skinparam usecase {
    BackgroundColor<<Core>> #FFB6C1    // Changer cette couleur
    BorderColor<<Core>> #FF1493
}
```

### Ajouter un Cas d'Utilisation

```plantuml
usecase "Nouveau cas\nd'utilisation" as UC_NEW

// L'associer à un acteur
cliente --> UC_NEW

// Ajouter une relation
UC_NEW .> UC_EXISTING : <<include>>
```

### Ajouter un Package

```plantuml
package "Nouveau Package" #TECHNOLOGY {
    usecase "Cas 1" as UC1
    usecase "Cas 2" as UC2
}
```

### Ajouter une Note

```plantuml
note right of UC_CREATE_BOOKING
  Cette fonctionnalité est
  au cœur du système
end note
```

---

## 💡 Conseils d'Utilisation

### Pour la Documentation
✅ Utiliser le **diagramme complet**
✅ Exporter en **PNG haute résolution** (ajouter `-Sdpi=300` en ligne de commande)
✅ Inclure dans le cahier des charges

### Pour les Présentations
✅ Utiliser le **diagramme simplifié**
✅ Exporter en **SVG** (meilleure qualité à toutes les tailles)
✅ Créer des diagrammes par acteur si besoin

### Pour le Développement
✅ Se référer au diagramme pour identifier les endpoints API
✅ Chaque cas d'utilisation = une ou plusieurs routes
✅ Utiliser pour créer les user stories

---

## 🐛 Résolution de Problèmes

### Le diagramme ne s'affiche pas dans VS Code

**Solutions :**
1. Vérifier que l'extension PlantUML est installée
2. Installer Graphviz : https://graphviz.org/download/
3. Redémarrer VS Code
4. Vérifier les logs : View > Output > PlantUML

### Erreur de syntaxe

**Solutions :**
1. Vérifier que chaque `usecase` a un identifiant unique
2. Vérifier que toutes les relations référencent des cas existants
3. Vérifier les guillemets et caractères spéciaux

### Le diagramme est trop grand

**Solutions pour le complet :**
1. Exporter en SVG (zoom infini)
2. Diviser en plusieurs diagrammes par package
3. Utiliser la version simplifiée pour la vue d'ensemble

---

## 📚 Ressources Utiles

- **Documentation PlantUML** : https://plantuml.com/fr/use-case-diagram
- **Guide de syntaxe** : https://plantuml.com/fr/guide
- **Galerie d'exemples** : https://real-world-plantuml.com/
- **Forum PlantUML** : https://forum.plantuml.net/

---

## 🎯 Utilisation dans le Projet

### Phase de Conception
- ✅ Valider les cas d'utilisation avec les parties prenantes
- ✅ Identifier tous les acteurs et leurs besoins
- ✅ Définir les priorités (Core, AI, Admin)

### Phase de Développement
- ✅ Créer les routes API correspondantes
- ✅ Implémenter les contrôleurs
- ✅ Créer les tests basés sur les cas d'utilisation

### Phase de Documentation
- ✅ Inclure dans le cahier des charges
- ✅ Créer la documentation utilisateur
- ✅ Former les utilisateurs

---

## 📧 Questions ?

Pour toute question sur les diagrammes ou leur utilisation, n'hésitez pas !

**Bon courage pour votre projet ! 🚀**
