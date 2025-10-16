# Résumé du Projet Pokémon Game API

## 🎯 Objectif
Créer une API REST en Express + TypeScript, connectée à PostgreSQL, pour gérer un système de jeu Pokémon simplifié en appliquant les principes de la programmation orientée objet (POO).

## ✅ Fonctionnalités Implémentées

### 1. Classes Métier (POO)

#### `Attack` (Attaque)
- **Propriétés** : nom, dégâts, limite d'usage, compteur d'usage
- **Méthodes** :
  - `use()` : utilise l'attaque et incrémente le compteur
  - `canUse()` : vérifie si l'attaque peut être utilisée
  - `resetUsage()` : réinitialise le compteur d'usage
  - `displayInfo()` : affiche les informations de l'attaque

#### `Pokemon` (Pokémon)
- **Propriétés** : nom, points de vie, attaques
- **Méthodes** :
  - `learnAttack()` : apprend une nouvelle attaque (max 4, sans doublon)
  - `heal()` : soigne le Pokémon (restaure PV et réinitialise attaques)
  - `attack()` : attaque un autre Pokémon de façon aléatoire
  - `takeDamage()` : inflige des dégâts
  - `isKO()` / `isAlive()` : vérifie l'état du Pokémon

#### `Trainer` (Dresseur)
- **Propriétés** : nom, niveau, expérience, liste de Pokémon
- **Méthodes** :
  - `addPokemon()` : ajoute un Pokémon
  - `healAllPokemons()` : soigne tous les Pokémon
  - `gainExperience()` : gagne de l'expérience (niveau +1 à 10 exp)
  - `randomChallenge()` : défi aléatoire
  - `deterministicChallenge()` : défi déterministe
  - `arena1()` : 100 combats aléatoires
  - `arena2()` : 100 combats déterministes

### 2. Base de Données PostgreSQL

#### Tables Créées
- `attacks` : stockage des attaques
- `trainers` : stockage des dresseurs
- `pokemons` : stockage des Pokémon
- `pokemon_attacks` : liaison Pokémon-Attaques

#### Services
- `DatabaseService` : gestion des connexions et requêtes
- `TrainerService` : CRUD des dresseurs et Pokémon
- `CombatService` : logique de combat

### 3. API REST Express

#### Endpoints Dresseurs
- `GET /api/trainers` : liste tous les dresseurs
- `GET /api/trainers/:id` : récupère un dresseur
- `POST /api/trainers` : crée un dresseur
- `PUT /api/trainers/:id` : met à jour un dresseur
- `DELETE /api/trainers/:id` : supprime un dresseur
- `POST /api/trainers/:id/pokemons` : ajoute un Pokémon
- `POST /api/trainers/:id/heal` : soigne tous les Pokémon

#### Endpoints Combat
- `POST /api/combat/random-challenge` : défi aléatoire
- `POST /api/combat/deterministic-challenge` : défi déterministe
- `POST /api/combat/arena1` : arène 1 (100 combats aléatoires)
- `POST /api/combat/arena2` : arène 2 (100 combats déterministes)
- `POST /api/combat/heal/:id` : soigne un dresseur
- `GET /api/combat/stats/:id` : statistiques de combat

### 4. Système de Combat

#### Défi Aléatoire
- Soigne tous les Pokémon des deux dresseurs
- Choisit un Pokémon aléatoire pour chaque dresseur
- Combat jusqu'à ce qu'un Pokémon soit KO

#### Défi Déterministe
- Chaque dresseur choisit son Pokémon avec le plus de PV
- Combat sans soin préalable

#### Arène 1
- 100 combats aléatoires successifs
- Le dresseur avec le plus haut niveau gagne (ou expérience en cas d'égalité)

#### Arène 2
- 100 combats déterministes consécutifs
- Arrêt si un dresseur perd tous ses Pokémon

### 5. Fonctionnalités Techniques

#### TypeScript
- Configuration complète avec `tsconfig.json`
- Interfaces pour tous les types
- Compilation vers JavaScript

#### Sécurité
- Helmet pour les en-têtes de sécurité
- CORS configuré
- Validation des données d'entrée

#### Gestion d'Erreurs
- Middleware de gestion d'erreurs global
- Messages d'erreur explicites
- Codes de statut HTTP appropriés

#### Données de Test
- 3 dresseurs (Ash, Misty, Brock)
- 6 Pokémon avec attaques aléatoires
- 10 attaques de base

## 🚀 Installation et Utilisation

### Prérequis
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Installation
```bash
cd pokemon-game-api
npm install
cp env.example .env
# Configurer .env avec vos paramètres PostgreSQL
npm run dev
```

### Test
```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/health

# Créer un dresseur
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'
```

## 📁 Structure du Projet

```
pokemon-game-api/
├── src/
│   ├── controllers/     # Contrôleurs Express
│   ├── models/         # Classes métier (Attack, Pokemon, Trainer)
│   ├── routes/         # Routes Express
│   ├── services/       # Services métier et base de données
│   ├── types/          # Interfaces TypeScript
│   └── index.ts        # Point d'entrée
├── examples/           # Exemples d'utilisation
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
├── README.md           # Documentation complète
└── PROJECT_SUMMARY.md  # Ce fichier
```

## 🎮 Exemple de Scénario

1. **Créer deux dresseurs** : Sacha et Ondine
2. **Ajouter des Pokémon** : Pikachu, Salamèche, Carapuce, Psykokwak
3. **Organiser un combat** : défi aléatoire ou déterministe
4. **Voir les résultats** : gagnant, rounds, détails du combat
5. **Organiser une arène** : 100 combats pour déterminer le champion

## 🔧 Points Techniques Remarquables

### Programmation Orientée Objet
- Encapsulation des données et méthodes
- Relations entre classes (Trainer → Pokemon → Attack)
- Polymorphisme avec les méthodes de combat
- Héritage potentiel pour différents types de Pokémon

### Architecture MVC
- **Models** : classes métier (Attack, Pokemon, Trainer)
- **Views** : réponses JSON de l'API
- **Controllers** : gestion des requêtes HTTP

### Base de Données
- Relations normalisées
- Contraintes d'intégrité
- Index pour les performances
- Données de test automatiques

### API REST
- Endpoints RESTful
- Codes de statut HTTP appropriés
- Validation des données
- Gestion d'erreurs complète

## 🎯 Objectifs Atteints

✅ **API REST en Express + TypeScript**  
✅ **Connexion PostgreSQL**  
✅ **Gestion des Pokémon avec POO**  
✅ **Système d'attaques avec limites d'usage**  
✅ **Gestion des dresseurs avec niveau/expérience**  
✅ **4 types de combats différents**  
✅ **Architecture modulaire et maintenable**  
✅ **Documentation complète**  
✅ **Données de test**  
✅ **Gestion d'erreurs robuste**  

Le projet respecte parfaitement les exigences demandées et implémente un système de jeu Pokémon complet avec une architecture professionnelle.

