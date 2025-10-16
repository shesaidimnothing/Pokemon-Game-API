# Configuration PostgreSQL - Guide Rapide

## 🚨 Erreur d'authentification PostgreSQL

L'erreur `password authentication failed for user "user"` indique un problème de configuration PostgreSQL.

## 🔧 Solutions Rapides

### Solution 1 : Utiliser le Mode Mock (Recommandé)
```bash
# Pas besoin de PostgreSQL !
npm run dev:mock
```

### Solution 2 : Configurer PostgreSQL correctement

#### Étape 1 : Créer le fichier .env
Créez un fichier `.env` dans le dossier `pokemon-game-api` avec ce contenu :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokemon_game
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Étape 2 : Configurer PostgreSQL

**Option A : Avec Docker (Le plus simple)**
```bash
# Arrêter le conteneur existant s'il y en a un
docker stop pokemon-postgres 2>/dev/null || true
docker rm pokemon-postgres 2>/dev/null || true

# Créer un nouveau conteneur avec le bon mot de passe
docker run --name pokemon-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pokemon_game -p 5432:5432 -d postgres:13

# Mettre à jour le .env
echo "DB_PASSWORD=password" >> .env
```

**Option B : Installation PostgreSQL locale**
1. Installer PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Pendant l'installation, noter le mot de passe du superutilisateur `postgres`
3. Créer la base de données :
   ```bash
   createdb pokemon_game
   ```
4. Mettre à jour le `.env` avec le bon mot de passe

#### Étape 3 : Tester la connexion
```bash
# Tester la connexion PostgreSQL
psql -h localhost -U postgres -d pokemon_game -c "SELECT 1;"
```

#### Étape 4 : Démarrer l'API
```bash
npm run dev
```

## 🎯 Recommandation

**Pour commencer rapidement :** Utilisez `npm run dev:mock`

**Pour un environnement de production :** Configurez PostgreSQL avec Docker

## 🧪 Test Rapide

Une fois l'API démarrée :

```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/health

# Voir les dresseurs
curl http://localhost:3000/api/trainers
```

## 🆘 Dépannage

### Erreur "password authentication failed"
- Vérifiez le mot de passe dans le fichier `.env`
- Assurez-vous que PostgreSQL est démarré
- Testez la connexion avec `psql`

### Erreur "database does not exist"
- Créez la base de données : `createdb pokemon_game`

### Port 5432 occupé
- Changez le port dans `.env` : `DB_PORT=5433`
- Redémarrez PostgreSQL sur le nouveau port
