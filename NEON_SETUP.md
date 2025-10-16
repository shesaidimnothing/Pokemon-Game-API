# Configuration Neon Database - Guide Complet

## 🎯 Configuration Neon avec votre connection string

Votre connection string Neon a été configurée ! Voici comment procéder :

## 🚀 Étapes de Configuration

### 1. Copier la configuration Neon
```bash
# Copier le fichier de configuration Neon
copy neon-config.env .env
```

### 2. Installer les dépendances (si pas déjà fait)
```bash
npm install
```

### 3. Configurer la base de données Neon
```bash
npm run setup:neon
```

Cette commande va :
- ✅ Se connecter à votre base Neon
- ✅ Créer toutes les tables nécessaires
- ✅ Insérer les données de test (3 dresseurs, 6 Pokémon, 10 attaques)

### 4. Démarrer l'API
```bash
npm run dev
```

## 🧪 Test de l'API

Une fois démarrée, testez l'API :

```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/health

# Voir tous les dresseurs
curl http://localhost:3000/api/trainers

# Organiser un combat
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

## 🔧 Configuration Neon

Votre configuration Neon :
- **Host**: `ep-lively-wind-adfofg7q-pooler.c-2.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **SSL**: Activé

## 📊 Données de Test Incluses

L'API inclut automatiquement :
- **3 dresseurs** : Ash, Misty, Brock
- **6 Pokémon** avec attaques aléatoires
- **10 attaques** de base

## 🆘 Dépannage

### Erreur de connexion
- Vérifiez que votre connection string Neon est correcte
- Assurez-vous que votre projet Neon est actif

### Erreur SSL
- La configuration SSL est déjà activée pour Neon

### Port occupé
- Changez le port dans `.env` : `PORT=3001`

## 🎮 Exemple Complet

```bash
# 1. Configurer Neon
npm run setup:neon

# 2. Démarrer l'API
npm run dev

# 3. Tester l'API
curl http://localhost:3000/health

# 4. Voir les dresseurs
curl http://localhost:3000/api/trainers

# 5. Organiser un combat
curl -X POST http://localhost:3000/api/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

## ✅ Avantages de Neon

- 🌐 **Cloud** : Pas d'installation locale requise
- 🔒 **Sécurisé** : SSL activé par défaut
- 🚀 **Rapide** : Connexion optimisée
- 💾 **Persistant** : Données sauvegardées dans le cloud
- 🔄 **Backup** : Sauvegardes automatiques

Votre API Pokémon est maintenant prête avec une base de données cloud professionnelle !
