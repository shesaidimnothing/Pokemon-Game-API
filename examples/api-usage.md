# Exemples d'utilisation de l'API Pokémon Game

## 🚀 Démarrage rapide

1. **Démarrer l'API** :
```bash
npm run dev
```

2. **Vérifier que l'API fonctionne** :
```bash
curl http://localhost:3000/health
```

## 📋 Exemples de requêtes

### 1. Gestion des Dresseurs

#### Créer un nouveau dresseur
```bash
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'
```

#### Récupérer tous les dresseurs
```bash
curl http://localhost:3000/api/trainers
```

#### Récupérer un dresseur spécifique
```bash
curl http://localhost:3000/api/trainers/1
```

#### Ajouter un Pokémon à un dresseur
```bash
curl -X POST http://localhost:3000/api/trainers/1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "maxLifePoint": 100}'
```

#### Soigner tous les Pokémon d'un dresseur
```bash
curl -X POST http://localhost:3000/api/trainers/1/heal
```

### 2. Système de Combat

#### Défi aléatoire
```bash
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

#### Défi déterministe
```bash
curl -X POST http://localhost:3000/api/combat/deterministic-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

#### Arène 1 (100 combats aléatoires)
```bash
curl -X POST http://localhost:3000/api/combat/arena1 \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

#### Arène 2 (100 combats déterministes)
```bash
curl -X POST http://localhost:3000/api/combat/arena2 \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

### 3. Statistiques

#### Obtenir les statistiques de combat d'un dresseur
```bash
curl http://localhost:3000/api/combat/stats/1
```

## 🎮 Scénario de jeu complet

### Étape 1: Créer deux dresseurs
```bash
# Créer le premier dresseur
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'

# Créer le deuxième dresseur
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Ondine"}'
```

### Étape 2: Ajouter des Pokémon
```bash
# Ajouter Pikachu à Sacha
curl -X POST http://localhost:3000/api/trainers/1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "maxLifePoint": 100}'

# Ajouter Salamèche à Sacha
curl -X POST http://localhost:3000/api/trainers/1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Salamèche", "maxLifePoint": 90}'

# Ajouter Carapuce à Ondine
curl -X POST http://localhost:3000/api/trainers/2/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Carapuce", "maxLifePoint": 95}'

# Ajouter Psykokwak à Ondine
curl -X POST http://localhost:3000/api/trainers/2/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Psykokwak", "maxLifePoint": 85}'
```

### Étape 3: Organiser un combat
```bash
# Défi aléatoire entre Sacha et Ondine
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

### Étape 4: Vérifier les résultats
```bash
# Vérifier l'état de Sacha
curl http://localhost:3000/api/trainers/1

# Vérifier l'état d'Ondine
curl http://localhost:3000/api/trainers/2
```

## 🔧 Utilisation avec JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function createTrainer(name) {
  try {
    const response = await axios.post(`${API_BASE}/trainers`, { name });
    console.log('Dresseur créé:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
}

async function addPokemon(trainerId, name, maxLifePoint) {
  try {
    const response = await axios.post(`${API_BASE}/trainers/${trainerId}/pokemons`, {
      name,
      maxLifePoint
    });
    console.log('Pokémon ajouté:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
}

async function randomChallenge(trainer1Id, trainer2Id) {
  try {
    const response = await axios.post(`${API_BASE}/combat/random-challenge`, {
      trainer1Id,
      trainer2Id
    });
    console.log('Résultat du combat:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
}

// Exemple d'utilisation
async function main() {
  const sacha = await createTrainer('Sacha');
  const ondine = await createTrainer('Ondine');
  
  await addPokemon(sacha.id, 'Pikachu', 100);
  await addPokemon(ondine.id, 'Carapuce', 95);
  
  const result = await randomChallenge(sacha.id, ondine.id);
  console.log('Le gagnant est:', result.winner.name);
}

main();
```

## 🐛 Dépannage

### L'API ne démarre pas
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les paramètres de connexion dans le fichier `.env`
- Assurez-vous que la base de données `pokemon_game` existe

### Erreur de connexion à la base de données
```bash
# Créer la base de données
createdb pokemon_game

# Vérifier la connexion
psql -d pokemon_game -c "SELECT 1;"
```

### Port déjà utilisé
Modifiez le port dans le fichier `.env` :
```env
PORT=3001
```

## 📊 Réponses d'exemple

### Réponse d'un dresseur
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sacha",
    "level": 5,
    "experience": 3,
    "pokemons": [
      {
        "id": 1,
        "name": "Pikachu",
        "lifePoint": 100,
        "maxLifePoint": 100,
        "attacks": [
          {
            "id": 1,
            "name": "Tackle",
            "damage": 10,
            "usageLimit": 5,
            "currentUsage": 0
          }
        ]
      }
    ]
  }
}
```

### Réponse d'un combat
```json
{
  "success": true,
  "data": {
    "winner": {
      "id": 1,
      "name": "Sacha",
      "level": 5,
      "experience": 4
    },
    "loser": {
      "id": 2,
      "name": "Ondine",
      "level": 4,
      "experience": 7
    },
    "rounds": 3,
    "details": [
      "Combat entre Pikachu (Sacha) et Carapuce (Ondine)",
      "Round 1: Pikachu inflige 10 dégâts à Carapuce (PV: 85)",
      "Round 1: Carapuce inflige 12 dégâts à Pikachu (PV: 88)",
      "Round 2: Pikachu inflige 10 dégâts à Carapuce (PV: 75)",
      "Round 2: Carapuce inflige 12 dégâts à Pikachu (PV: 76)",
      "Round 3: Pikachu inflige 10 dégâts à Carapuce (PV: 65)",
      "Round 3: Carapuce inflige 12 dégâts à Pikachu (PV: 64)",
      "Le gagnant est Sacha !"
    ]
  }
}
```

