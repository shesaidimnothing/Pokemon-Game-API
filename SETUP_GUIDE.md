# Guide de Configuration - Pokémon Game API

## 🚨 Problème PostgreSQL Résolu !

Vous avez rencontré une erreur de connexion PostgreSQL. Voici **3 solutions** pour faire fonctionner l'API :

## 🎯 Solution 1 : Mode Mock (Recommandé pour le développement)

**Aucune installation PostgreSQL requise !**

```bash
# Utiliser le mode mock (données en mémoire)
npm run dev:mock
```

✅ **Avantages :**
- Fonctionne immédiatement
- Pas d'installation requise
- Parfait pour tester l'API
- Toutes les fonctionnalités disponibles

❌ **Inconvénients :**
- Les données sont perdues au redémarrage
- Pas de persistance

## 🐘 Solution 2 : PostgreSQL avec Docker (Recommandé)

```bash
# Installer Docker Desktop
# Puis lancer PostgreSQL
docker run --name pokemon-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pokemon_game -p 5432:5432 -d postgres:13

# Utiliser l'API normale
npm run dev
```

## 🐘 Solution 3 : Installation PostgreSQL complète

### Windows :
1. Télécharger PostgreSQL : https://www.postgresql.org/download/windows/
2. Installer avec les paramètres par défaut
3. Noter le mot de passe du superutilisateur `postgres`
4. Créer la base de données :
   ```sql
   createdb pokemon_game
   ```
5. Configurer `.env` :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pokemon_game
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   ```

## 🚀 Démarrage Rapide

### Option A : Mode Mock (Le plus simple)
```bash
cd pokemon-game-api
npm run dev:mock
```

### Option B : Avec PostgreSQL
```bash
cd pokemon-game-api
# Configurer .env avec vos paramètres PostgreSQL
npm run dev
```

## 🧪 Test de l'API

Une fois démarrée, testez l'API :

```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/health

# Voir tous les dresseurs (données de test incluses)
curl http://localhost:3000/api/trainers

# Créer un nouveau dresseur
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'

# Organiser un combat
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

## 📊 Données de Test Incluses

L'API inclut automatiquement :
- **3 dresseurs** : Ash, Misty, Brock
- **6 Pokémon** avec attaques aléatoires
- **10 attaques** de base

## 🔧 Scripts Disponibles

- `npm run dev` : Mode PostgreSQL (nécessite PostgreSQL)
- `npm run dev:mock` : Mode Mock (aucune installation requise)
- `npm run build` : Compiler TypeScript
- `npm start` : Mode production

## 🎮 Exemple Complet

```bash
# 1. Démarrer l'API
npm run dev:mock

# 2. Vérifier les dresseurs existants
curl http://localhost:3000/api/trainers

# 3. Organiser un combat entre Ash (ID: 1) et Misty (ID: 2)
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'

# 4. Voir les statistiques d'Ash
curl http://localhost:3000/api/combat/stats/1
```

## 🆘 Dépannage

### Erreur "ECONNREFUSED"
- **Solution** : Utilisez `npm run dev:mock` au lieu de `npm run dev`

### Port 3000 occupé
- Modifiez le port dans `.env` : `PORT=3001`

### Erreur de compilation TypeScript
- Vérifiez que tous les fichiers sont sauvegardés
- Redémarrez avec `npm run dev:mock`

## 📚 Documentation Complète

- **README.md** : Documentation complète de l'API
- **examples/api-usage.md** : Exemples d'utilisation détaillés
- **PROJECT_SUMMARY.md** : Résumé technique du projet

## 🎯 Recommandation

**Pour commencer rapidement :** Utilisez `npm run dev:mock`

**Pour un environnement de production :** Installez PostgreSQL et utilisez `npm run dev`

L'API fonctionne parfaitement dans les deux modes avec toutes les fonctionnalités !
