# Pokémon Game API

Une API REST en Express + TypeScript, connectée à une base de données PostgreSQL, permettant de gérer un système de jeu Pokémon simplifié avec des principes de programmation orientée objet (POO).

## 🚀 Fonctionnalités

### Gestion des Pokémon
- Chaque Pokémon possède un nom, des points de vie (lifePoint), et une liste d'attaques
- Un Pokémon peut apprendre une attaque (max 4 attaques, sans doublon)
- Soin des Pokémon (restaure les PV et réinitialise les usages des attaques)
- Attaque aléatoire d'un autre Pokémon avec l'une de ses attaques disponibles

### Gestion des Attaques
- Nom, dégâts, limite d'usage, et compteur d'usage
- Méthode d'affichage des informations sous forme lisible

### Gestion des Dresseurs
- Nom, niveau, expérience, et liste de Pokémon
- Ajout de Pokémon, soin de tous les Pokémon à la taverne
- Gain d'expérience (et augmentation de niveau lorsque l'expérience atteint 10)

### Système de Combat
- **Défi aléatoire** : Deux dresseurs soignent leurs Pokémon, choisissent un Pokémon aléatoire et combattent
- **Arène 1** : 100 combats aléatoires successifs
- **Défi déterministe** : Chaque dresseur choisit son Pokémon avec le plus de PV
- **Arène 2** : 100 combats déterministes consécutifs

## 🛠️ Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- PostgreSQL (version 12 ou supérieure)
- npm ou yarn

### Configuration

1. Cloner le projet et installer les dépendances :
```bash
cd pokemon-game-api
npm install
```

2. Configurer la base de données :
```bash
# Créer une base de données PostgreSQL
createdb pokemon_game

# Copier le fichier d'environnement
cp env.example .env
```

3. Modifier le fichier `.env` avec vos paramètres de base de données :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokemon_game
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
```

### Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

L'API sera disponible sur `http://localhost:3000`

## 📚 Documentation de l'API

### Endpoints des Dresseurs

#### `GET /api/trainers`
Récupère tous les dresseurs

#### `GET /api/trainers/:id`
Récupère un dresseur par ID

#### `POST /api/trainers`
Crée un nouveau dresseur
```json
{
  "name": "Ash"
}
```

#### `PUT /api/trainers/:id`
Met à jour un dresseur
```json
{
  "name": "Ash Ketchum",
  "level": 5,
  "experience": 3
}
```

#### `DELETE /api/trainers/:id`
Supprime un dresseur

#### `POST /api/trainers/:id/pokemons`
Ajoute un Pokémon à un dresseur
```json
{
  "name": "Pikachu",
  "maxLifePoint": 100
}
```

#### `POST /api/trainers/:id/heal`
Soigne tous les Pokémon d'un dresseur

### Endpoints de Combat

#### `POST /api/combat/random-challenge`
Défi aléatoire entre deux dresseurs
```json
{
  "trainer1Id": 1,
  "trainer2Id": 2
}
```

#### `POST /api/combat/deterministic-challenge`
Défi déterministe entre deux dresseurs
```json
{
  "trainer1Id": 1,
  "trainer2Id": 2
}
```

#### `POST /api/combat/arena1`
Arène 1: 100 combats aléatoires
```json
{
  "trainer1Id": 1,
  "trainer2Id": 2
}
```

#### `POST /api/combat/arena2`
Arène 2: 100 combats déterministes
```json
{
  "trainer1Id": 1,
  "trainer2Id": 2
}
```

#### `POST /api/combat/heal/:id`
Soigne tous les Pokémon d'un dresseur

#### `GET /api/combat/stats/:id`
Statistiques de combat d'un dresseur

### Endpoints Utilitaires

#### `GET /health`
Vérifie la santé de l'API

#### `GET /`
Documentation complète de l'API

## 🏗️ Architecture

### Structure du Projet
```
src/
├── controllers/     # Contrôleurs Express
├── models/         # Classes métier (Attack, Pokemon, Trainer)
├── routes/         # Routes Express
├── services/       # Services métier et base de données
├── types/          # Interfaces TypeScript
└── index.ts        # Point d'entrée de l'application
```

### Classes Principales

#### `Attack`
- Propriétés : nom, dégâts, limite d'usage, compteur d'usage
- Méthodes : `use()`, `canUse()`, `resetUsage()`, `displayInfo()`

#### `Pokemon`
- Propriétés : nom, points de vie, attaques
- Méthodes : `learnAttack()`, `heal()`, `attack()`, `takeDamage()`, `isKO()`

#### `Trainer`
- Propriétés : nom, niveau, expérience, Pokémon
- Méthodes : `addPokemon()`, `healAllPokemons()`, `gainExperience()`, `randomChallenge()`, `deterministicChallenge()`, `arena1()`, `arena2()`

## 🧪 Données de Test

L'API inclut des données de test automatiquement insérées au démarrage :
- 3 dresseurs (Ash, Misty, Brock)
- 6 Pokémon avec des attaques aléatoires
- 10 attaques de base

## 🔧 Scripts Disponibles

- `npm run dev` : Démarre le serveur en mode développement avec rechargement automatique
- `npm run build` : Compile le TypeScript en JavaScript
- `npm start` : Démarre le serveur en mode production
- `npm test` : Lance les tests (à implémenter)

## 🐛 Gestion d'Erreurs

L'API inclut une gestion d'erreurs complète avec :
- Validation des données d'entrée
- Messages d'erreur explicites
- Codes de statut HTTP appropriés
- Logging des erreurs

## 📝 Exemples d'Utilisation

### Créer un dresseur et ajouter un Pokémon
```bash
# Créer un dresseur
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'

# Ajouter un Pokémon
curl -X POST http://localhost:3000/api/trainers/1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "maxLifePoint": 100}'
```

### Organiser un combat
```bash
# Défi aléatoire
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

