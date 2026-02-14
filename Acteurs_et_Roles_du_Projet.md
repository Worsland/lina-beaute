# 👥 ACTEURS DU PROJET
## Plateforme de Réservation Beauté & Spa avec IA

---

## 📊 VUE D'ENSEMBLE DES ACTEURS

```
┌─────────────────────────────────────────────────────────────────┐
│                    ÉCOSYSTÈME DU PROJET                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   CLIENTES   │────▶│  PLATEFORME  │◀────│ ÉTABLISSE-   │   │
│  │              │     │              │     │    MENTS     │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                    │                     │           │
│         │                    ▼                     │           │
│         │            ┌──────────────┐              │           │
│         └───────────▶│  ASSISTANT   │◀─────────────┘           │
│                      │      IA      │                          │
│                      └──────────────┘                          │
│                                                                 │
│                      ┌──────────────┐                          │
│                      │    SUPER     │                          │
│                      │    ADMIN     │                          │
│                      └──────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. LES CLIENTES (UTILISATRICES FINALES)

### 1.1 Profil
**Qui sont-elles ?**
- Femmes de 18 à 65 ans
- Vivant en Tunisie (principalement zones urbaines)
- Recherchant des services de beauté et bien-être
- À l'aise avec la technologie mobile/web

### 1.2 Besoins
- Trouver facilement des établissements de qualité
- Réserver rapidement et simplement
- Obtenir des recommandations personnalisées
- Consulter les avis et tarifs
- Gérer leurs rendez-vous

### 1.3 Rôles et Permissions

#### A. Avant Inscription (Visiteur)
**Peut :**
- ✅ Naviguer sur le site
- ✅ Utiliser l'assistant IA pour rechercher
- ✅ Consulter les établissements et services
- ✅ Voir les avis publics
- ✅ Visualiser les disponibilités

**Ne peut pas :**
- ❌ Effectuer des réservations
- ❌ Laisser des avis
- ❌ Sauvegarder des favoris
- ❌ Accéder à l'historique

#### B. Après Inscription (Cliente)
**Peut :**
- ✅ Tout ce que peut faire un visiteur, PLUS :
- ✅ **Créer des réservations**
- ✅ **Gérer son profil** (infos personnelles, préférences)
- ✅ **Consulter l'historique** de réservations
- ✅ **Modifier/Annuler** ses réservations
- ✅ **Ajouter des favoris**
- ✅ **Laisser des avis** après prestation
- ✅ **Recevoir des notifications** (email, SMS)
- ✅ **Obtenir des recommandations** personnalisées
- ✅ **Interagir avec l'IA** de manière contextuelle

**Ne peut pas :**
- ❌ Accéder au dashboard établissement
- ❌ Modifier les informations des établissements
- ❌ Gérer les disponibilités
- ❌ Voir les données d'autres clientes

### 1.4 Parcours Utilisateur Type

```
1. Arrivée sur la plateforme
   ↓
2. Utilisation de l'assistant IA
   "Je cherche un massage relaxant demain après-midi"
   ↓
3. L'IA analyse et propose des résultats filtrés
   ↓
4. Consultation des fiches établissements
   ↓
5. Sélection d'un créneau disponible
   ↓
6. Inscription/Connexion (si première visite)
   ↓
7. Confirmation de la réservation
   ↓
8. Réception de confirmation (email + SMS)
   ↓
9. Rappels automatiques (24h et 2h avant)
   ↓
10. Prestation effectuée
   ↓
11. Invitation à laisser un avis
```

### 1.5 Interfaces Principales

- **Page d'accueil** : Recherche et découverte
- **Interface IA** : Chat conversationnel
- **Recherche avancée** : Filtres détaillés
- **Fiche établissement** : Informations complètes
- **Réservation** : Calendrier et sélection
- **Mon profil** : Gestion compte
- **Mes réservations** : Historique et gestion
- **Mes favoris** : Liste sauvegardée

---

## 2. LES ÉTABLISSEMENTS (PROPRIÉTAIRES/GÉRANTS)

### 2.1 Profil
**Qui sont-ils ?**
- Propriétaires d'instituts de beauté
- Gérants de spas
- Responsables de salons de coiffure
- Directeurs de centres esthétiques

### 2.2 Besoins
- Augmenter la visibilité
- Optimiser le remplissage des créneaux
- Gérer les réservations efficacement
- Réduire les no-shows
- Analyser les performances
- Communiquer avec les clientes

### 2.3 Rôles et Permissions

#### A. Administrateur Établissement
**Peut :**
- ✅ **Gérer le profil** de l'établissement
  - Modifier informations (nom, description, coordonnées)
  - Ajouter/modifier photos et vidéos
  - Définir la zone de chalandise
  - Mettre à jour les horaires d'ouverture

- ✅ **Gérer les services**
  - Créer/modifier/supprimer des prestations
  - Définir les tarifs
  - Spécifier les durées
  - Catégoriser les services

- ✅ **Gérer les réservations**
  - Voir toutes les réservations (passées, actuelles, futures)
  - Créer des réservations manuellement
  - Modifier les réservations
  - Annuler des réservations avec raison
  - Marquer comme "complété" ou "no-show"
  - Gérer les listes d'attente

- ✅ **Gérer l'équipe**
  - Ajouter/modifier des praticiennes
  - Définir les spécialités
  - Gérer les plannings individuels
  - Bloquer des plages horaires (congés, absences)

- ✅ **Gérer les disponibilités**
  - Configurer les créneaux disponibles
  - Bloquer des périodes
  - Définir les temps de pause
  - Gérer les temps de préparation entre rendez-vous

- ✅ **Gérer la clientèle**
  - Consulter la base de données clientes
  - Voir l'historique par cliente
  - Ajouter des notes privées
  - Consulter les préférences

- ✅ **Répondre aux avis**
  - Lire les avis reçus
  - Répondre publiquement
  - Signaler des avis inappropriés

- ✅ **Accéder aux statistiques**
  - Dashboard avec KPIs
  - Rapports de chiffre d'affaires
  - Analyse du taux d'occupation
  - Prestations les plus demandées
  - Statistiques par praticienne
  - Export des données

- ✅ **Marketing et communication**
  - Créer des promotions
  - Envoyer des newsletters
  - Campagnes SMS ciblées
  - Gérer les offres spéciales

- ✅ **Configurer les paramètres**
  - Politique d'annulation
  - Notifications automatiques
  - Délai minimum de réservation
  - Nombre maximum de réservations par cliente

**Ne peut pas :**
- ❌ Modifier les données d'autres établissements
- ❌ Accéder aux données personnelles sensibles des clientes
- ❌ Supprimer des avis (sauf via modération admin)
- ❌ Modifier les paramètres globaux de la plateforme
- ❌ Voir les statistiques d'autres établissements

#### B. Employé/Praticienne (Optionnel - Phase 2)
**Peut :**
- ✅ Voir son propre planning
- ✅ Consulter les réservations qui la concernent
- ✅ Marquer les prestations comme complétées
- ✅ Ajouter des notes sur les prestations

**Ne peut pas :**
- ❌ Modifier les tarifs
- ❌ Accéder aux statistiques globales
- ❌ Modifier le profil de l'établissement
- ❌ Gérer d'autres employées

### 2.4 Parcours Utilisateur Type

```
1. Inscription sur la plateforme
   ↓
2. Création du profil établissement
   - Informations de base
   - Localisation
   - Photos
   ↓
3. Ajout du catalogue de services
   - Prestations avec détails
   - Tarifs
   - Durées
   ↓
4. Configuration des disponibilités
   - Horaires d'ouverture
   - Créneaux disponibles
   ↓
5. Ajout de l'équipe (optionnel)
   ↓
6. Validation par l'administrateur plateforme
   ↓
7. Publication et visibilité
   ↓
8. Gestion quotidienne
   - Consultation du dashboard
   - Gestion des réservations
   - Réponse aux avis
   ↓
9. Analyse et optimisation
   - Consultation des rapports
   - Ajustement des disponibilités
   - Création de promotions
```

### 2.5 Interfaces Principales

- **Dashboard** : Vue d'ensemble et KPIs
- **Calendrier** : Gestion des réservations
- **Profil établissement** : Gestion des informations
- **Catalogue services** : CRUD prestations
- **Équipe** : Gestion du personnel
- **Disponibilités** : Configuration planning
- **Clientes** : Base de données et historique
- **Avis** : Consultation et réponses
- **Statistiques** : Rapports et analyses
- **Marketing** : Promotions et communications
- **Paramètres** : Configuration

---

## 3. L'ASSISTANT IA (GEMINI)

### 3.1 Profil
**Qu'est-ce que c'est ?**
- Intelligence artificielle conversationnelle
- Propulsé par Google Gemini
- Multilingue (Français, Arabe, Anglais)
- Disponible 24/7

### 3.2 Rôle Principal
**Agent conversationnel intelligent** qui facilite l'interaction entre les clientes et la plateforme.

### 3.3 Responsabilités et Capacités

#### A. Compréhension du Langage Naturel
**Peut :**
- ✅ **Analyser les requêtes** en langage naturel
  - "Je cherche un massage relaxant demain après-midi pas cher"
  - "J'ai besoin d'une manucure gel pour samedi matin"
  
- ✅ **Extraire les informations clés**
  - Type de prestation
  - Localisation souhaitée
  - Date et heure
  - Budget
  - Préférences spécifiques

- ✅ **Gérer le contexte conversationnel**
  - Mémoriser les échanges précédents
  - Faire des références croisées
  - Poser des questions de clarification

#### B. Recherche et Filtrage Intelligent
**Peut :**
- ✅ **Appliquer des filtres automatiquement**
  - Filtrer par type de service
  - Filtrer par localisation géographique
  - Filtrer par disponibilité
  - Filtrer par gamme de prix
  - Filtrer par note/avis

- ✅ **Effectuer des recherches géospatiales**
  - Trouver les établissements à proximité
  - Calculer les distances
  - Proposer des alternatives

- ✅ **Prioriser les résultats**
  - Meilleure correspondance avec la demande
  - Note et avis
  - Disponibilité immédiate

#### C. Recommandations Personnalisées
**Peut :**
- ✅ **Analyser le profil utilisateur**
  - Historique de réservations
  - Préférences enregistrées
  - Type de peau/cheveux
  - Allergies

- ✅ **Suggérer des services adaptés**
  - Basé sur l'historique
  - Basé sur les tendances
  - Basé sur les besoins exprimés

- ✅ **Proposer des établissements**
  - Nouveaux établissements correspondants
  - Établissements similaires aux favoris
  - Promotions en cours

#### D. Automatisation de la Réservation
**Peut :**
- ✅ **Guider le processus de réservation**
  - Présenter les créneaux disponibles
  - Expliquer les prestations
  - Calculer les durées totales

- ✅ **Effectuer des réservations**
  - Vérifier la disponibilité en temps réel
  - Confirmer avec l'utilisatrice
  - Enregistrer la réservation
  - Envoyer les confirmations

- ✅ **Gérer les modifications**
  - Proposer des alternatives si indisponible
  - Aider à la reprogrammation
  - Traiter les annulations

#### E. Support Client
**Peut :**
- ✅ **Répondre aux questions fréquentes**
  - Politique d'annulation
  - Méthodes de paiement
  - Accès aux établissements
  - Durée des prestations

- ✅ **Fournir des informations**
  - Détails sur les services
  - Descriptions des prestations
  - Conseils beauté généraux

- ✅ **Escalader si nécessaire**
  - Rediriger vers le support humain
  - Signaler des problèmes complexes

### 3.4 Limites

**Ne peut pas :**
- ❌ Effectuer des paiements
- ❌ Modifier les données sans confirmation
- ❌ Accéder aux données médicales sensibles
- ❌ Donner des conseils médicaux
- ❌ Garantir des résultats de traitement

### 3.5 Interactions Type

```
Cliente: "Je cherche un soin du visage anti-âge"
IA: "J'ai trouvé 5 instituts proposant des soins anti-âge. 
     Avez-vous une préférence de localisation ou de budget ?"

Cliente: "Plutôt vers Lac 2, pas trop cher"
IA: "Parfait ! Voici 2 instituts à Lac 2 dans une gamme de 
     prix abordable. Le premier, 'Beauté Éternelle', propose 
     un soin anti-âge avec acide hyaluronique à 80 DT (60 min). 
     Souhaitez-vous voir les disponibilités ?"

Cliente: "Oui, pour cette semaine"
IA: "Voici les créneaux disponibles cette semaine :
     - Mercredi 14:00, 16:30
     - Vendredi 10:00, 15:00
     Lequel préférez-vous ?"

Cliente: "Vendredi à 15h"
IA: "Excellent choix ! Je confirme :
     📅 Vendredi 16 février à 15:00
     💆 Soin visage anti-âge (60 min)
     📍 Beauté Éternelle, Lac 2
     💰 80 DT
     
     Souhaitez-vous confirmer cette réservation ?"
```

---

## 4. LE SUPER ADMINISTRATEUR (VOUS / ÉQUIPE TECHNIQUE)

### 4.1 Profil
**Qui est-ce ?**
- Développeur(s) de la plateforme
- Propriétaire du projet
- Équipe technique de maintenance
- Niveau d'accès le plus élevé

### 4.2 Rôle Principal
**Gestionnaire global de la plateforme** avec tous les privilèges.

### 4.3 Responsabilités et Permissions

#### A. Gestion Globale
**Peut :**
- ✅ **Accéder à toutes les données**
  - Tous les utilisateurs
  - Tous les établissements
  - Toutes les réservations
  - Toutes les statistiques

- ✅ **Gérer les utilisateurs**
  - Créer/modifier/supprimer des comptes
  - Activer/désactiver des comptes
  - Réinitialiser des mots de passe
  - Modifier les rôles

- ✅ **Gérer les établissements**
  - Valider les inscriptions
  - Vérifier les établissements
  - Modifier les informations
  - Suspendre/activer des comptes établissement

- ✅ **Modération du contenu**
  - Valider/rejeter les avis
  - Supprimer du contenu inapproprié
  - Gérer les signalements
  - Appliquer les politiques de la plateforme

#### B. Configuration Technique
**Peut :**
- ✅ **Gérer la base de données**
  - Backups réguliers
  - Migrations de données
  - Optimisation des performances
  - Nettoyage des données obsolètes

- ✅ **Configurer l'IA**
  - Ajuster les paramètres Gemini
  - Améliorer les prompts
  - Entraîner sur de nouvelles données
  - Monitorer les performances IA

- ✅ **Gérer les APIs**
  - Configuration des clés API
  - Gestion des quotas
  - Monitoring des appels
  - Intégration de nouveaux services

- ✅ **Sécurité**
  - Gestion des certificats SSL
  - Configuration des pare-feu
  - Monitoring des tentatives d'intrusion
  - Mise à jour des dépendances de sécurité

#### C. Analyse et Business Intelligence
**Peut :**
- ✅ **Statistiques globales**
  - Nombre total d'utilisateurs
  - Nombre de réservations
  - Chiffre d'affaires de la plateforme
  - Taux de conversion
  - Taux de rétention

- ✅ **Analyse de performance**
  - Temps de réponse
  - Taux d'erreur
  - Utilisation de l'IA
  - Satisfaction utilisateur

- ✅ **Rapports d'activité**
  - Rapports quotidiens/hebdomadaires/mensuels
  - Tendances du marché
  - Comportement utilisateur
  - ROI des établissements

#### D. Support et Maintenance
**Peut :**
- ✅ **Support technique**
  - Résoudre les bugs
  - Gérer les tickets de support
  - Former les établissements
  - Assister les utilisateurs

- ✅ **Maintenance**
  - Mises à jour régulières
  - Corrections de bugs
  - Optimisations
  - Déploiement de nouvelles fonctionnalités

- ✅ **Communication**
  - Envoyer des annonces globales
  - Notifier des maintenances programmées
  - Informer des nouvelles fonctionnalités

### 4.4 Interfaces Principales

- **Dashboard admin global** : Vue d'ensemble de la plateforme
- **Gestion utilisateurs** : CRUD complet
- **Gestion établissements** : Validation et modération
- **Modération contenu** : Avis, signalements
- **Analytics** : Statistiques détaillées
- **Configuration système** : Paramètres techniques
- **Logs et monitoring** : Surveillance en temps réel
- **Support** : Gestion des tickets

### 4.5 Flux de Travail Type

```
1. Monitoring quotidien
   - Vérifier les performances
   - Consulter les alertes
   ↓
2. Validation des nouveaux établissements
   - Vérifier les informations
   - Valider ou rejeter
   ↓
3. Modération du contenu
   - Traiter les signalements
   - Gérer les avis litigieux
   ↓
4. Support
   - Répondre aux tickets
   - Résoudre les problèmes
   ↓
5. Analyse
   - Consulter les statistiques
   - Identifier les tendances
   - Prendre des décisions stratégiques
   ↓
6. Maintenance
   - Mises à jour
   - Optimisations
   - Corrections
```

---

## 5. ACTEURS SECONDAIRES

### 5.1 Services Tiers

#### A. Google Gemini API
- **Rôle** : Fournir l'intelligence artificielle
- **Interaction** : Via API REST
- **Responsabilité** : Traitement du langage naturel

#### B. Service SMS (Twilio / autre)
- **Rôle** : Envoyer les notifications SMS
- **Interaction** : Via API
- **Responsabilité** : Delivery des messages

#### C. Service Email (SendGrid / Mailgun)
- **Rôle** : Envoyer les emails
- **Interaction** : Via API SMTP
- **Responsabilité** : Delivery des emails

#### D. Google Maps API
- **Rôle** : Géolocalisation et cartographie
- **Interaction** : Via API JavaScript
- **Responsabilité** : Affichage cartes et calcul distances

#### E. Hébergement Cloud (AWS/Google Cloud/Azure)
- **Rôle** : Infrastructure serveur
- **Interaction** : Configuration et déploiement
- **Responsabilité** : Disponibilité et performances

### 5.2 Stakeholders Business (Phase future)

#### A. Partenaires Commerciaux
- **Rôle** : Marques de beauté, distributeurs
- **Intérêt** : Promotion de produits
- **Interaction** : Via dashboard partenaire

#### B. Investisseurs (si applicable)
- **Rôle** : Financement
- **Intérêt** : ROI et croissance
- **Interaction** : Rapports périodiques

---

## 6. MATRICE DE RESPONSABILITÉS (RACI)

| Fonctionnalité | Cliente | Établissement | IA | Super Admin |
|----------------|---------|---------------|----|----|
| **Inscription** | R/A | R/A | I | C |
| **Recherche services** | R | I | A | C |
| **Création réservation** | R/A | I | C | I |
| **Gestion réservation** | R/A | C/I | - | I |
| **Ajout services** | - | R/A | - | C |
| **Gestion disponibilités** | - | R/A | I | C |
| **Avis client** | R/A | I | - | C |
| **Réponse aux avis** | I | R/A | - | C |
| **Statistiques établissement** | - | R/A | - | I |
| **Modération** | - | - | - | R/A |
| **Configuration IA** | - | - | - | R/A |
| **Maintenance technique** | - | - | - | R/A |

**Légende :**
- **R** (Responsible) : Réalise l'action
- **A** (Accountable) : Responsable final
- **C** (Consulted) : Consulté
- **I** (Informed) : Informé

---

## 7. FLUX D'INTERACTIONS ENTRE ACTEURS

### Scénario 1 : Nouvelle Réservation

```
Cliente
  │
  ├─► Requête en langage naturel
  │
  ▼
Assistant IA
  │
  ├─► Analyse et extraction d'infos
  ├─► Recherche dans la BDD
  ├─► Filtre les établissements
  │
  ▼
Établissement (consultation)
  │
  ├─► Vérification disponibilités
  │
  ▼
Assistant IA
  │
  ├─► Présentation options
  │
  ▼
Cliente
  │
  ├─► Sélection créneau
  │
  ▼
Système
  │
  ├─► Création réservation
  ├─► Notification établissement
  ├─► Confirmation cliente
  │
  ▼
Établissement + Cliente
  │
  └─► Réception notifications
```

### Scénario 2 : Validation Nouvel Établissement

```
Établissement
  │
  ├─► Inscription
  ├─► Remplissage profil
  │
  ▼
Système
  │
  ├─► Enregistrement BDD
  ├─► Notification admin
  │
  ▼
Super Admin
  │
  ├─► Vérification informations
  ├─► Validation documents
  │
  ▼ (Approuvé)
Système
  │
  ├─► Activation compte
  ├─► Notification établissement
  │
  ▼
Établissement
  │
  └─► Accès dashboard
       Publication services
```

### Scénario 3 : Avis Client

```
Cliente
  │
  ├─► Prestation effectuée
  │
  ▼
Système
  │
  ├─► Invitation à laisser avis
  │
  ▼
Cliente
  │
  ├─► Rédaction avis + note
  │
  ▼
Système
  │
  ├─► Enregistrement
  ├─► Notification établissement
  │
  ▼
Établissement
  │
  ├─► Lecture avis
  ├─► Rédaction réponse
  │
  ▼
Système
  │
  ├─► Publication réponse
  ├─► Notification cliente
  │
  ▼
Cliente + Visiteurs
  │
  └─► Visualisation échange public
```

---

## 8. RÉCAPITULATIF DES COMPTES PAR ACTEUR

| Acteur | Nombre de comptes | Type | Accès |
|--------|-------------------|------|-------|
| **Clientes** | Illimité | Multiple | Web + Mobile |
| **Établissements** | Illimité | Multiple | Web (dashboard) |
| **Praticiennes** | Multiple par établissement | Multiple | Web (limité) |
| **Super Admin** | 1-3 | Unique | Web (complet) |
| **IA Assistant** | 1 (service) | Unique | API |

---

## 9. CONCLUSION

### Interaction Globale
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   CLIENTES ◄──────────────────► ASSISTANT IA            │
│      ▲                               ▲                   │
│      │                               │                   │
│      │         PLATEFORME            │                   │
│      │              │                │                   │
│      ▼              ▼                ▼                   │
│  NOTIFICATIONS  RÉSERVATIONS    RECOMMANDATIONS         │
│      ▲              │                │                   │
│      │              │                │                   │
│      │              ▼                │                   │
│      └───────► ÉTABLISSEMENTS ◄──────┘                  │
│                     ▲                                    │
│                     │                                    │
│                     ▼                                    │
│              SUPER ADMIN                                 │
│          (Gestion globale)                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Points Clés
- **4 acteurs principaux** : Clientes, Établissements, IA, Super Admin
- **Rôles clairement définis** avec permissions spécifiques
- **Interactions fluides** via la plateforme centrale
- **IA au cœur** de l'expérience utilisateur
- **Super Admin** en position de surveillance et contrôle
