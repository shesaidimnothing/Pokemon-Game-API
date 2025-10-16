import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { mockDatabaseService } from './services/mockDatabase';
import trainerRoutes from './routes/mockTrainerRoutes';
import combatRoutes from './routes/mockCombatRoutes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/trainers', trainerRoutes);
app.use('/api/combat', combatRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Pokémon Game is running (Mock Database Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Mock (In-Memory)'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue dans l\'API Pokémon Game ! (Mode Mock)',
    database: 'Mock (In-Memory) - Pas de PostgreSQL requis',
    endpoints: {
      trainers: '/api/trainers',
      combat: '/api/combat',
      health: '/health'
    },
    documentation: {
      trainers: {
        'GET /api/trainers': 'Récupère tous les dresseurs',
        'GET /api/trainers/:id': 'Récupère un dresseur par ID',
        'POST /api/trainers': 'Crée un nouveau dresseur',
        'PUT /api/trainers/:id': 'Met à jour un dresseur',
        'DELETE /api/trainers/:id': 'Supprime un dresseur',
        'POST /api/trainers/:id/pokemons': 'Ajoute un Pokémon à un dresseur',
        'POST /api/trainers/:id/heal': 'Soigne tous les Pokémon d\'un dresseur'
      },
      combat: {
        'POST /api/combat/random-challenge': 'Défi aléatoire entre deux dresseurs',
        'POST /api/combat/deterministic-challenge': 'Défi déterministe entre deux dresseurs',
        'POST /api/combat/arena1': 'Arène 1: 100 combats aléatoires',
        'POST /api/combat/arena2': 'Arène 2: 100 combats déterministes',
        'POST /api/combat/heal/:id': 'Soigne tous les Pokémon d\'un dresseur',
        'GET /api/combat/stats/:id': 'Statistiques de combat d\'un dresseur'
      }
    }
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Fonction pour initialiser l'application
async function initializeApp() {
  try {
    console.log('🚀 Démarrage en mode Mock Database...');
    console.log('✅ Pas de PostgreSQL requis - données en mémoire');
    console.log('✅ Données de test automatiquement chargées');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📚 Documentation disponible sur http://localhost:${PORT}`);
      console.log(`🏥 Santé de l'API: http://localhost:${PORT}/health`);
      console.log('💡 Mode Mock - Les données sont perdues au redémarrage');
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Gestion des signaux de fermeture
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await mockDatabaseService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await mockDatabaseService.close();
  process.exit(0);
});

// Initialiser l'application
initializeApp();
