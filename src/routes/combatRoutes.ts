import { Router } from 'express';
import { combatController } from '../controllers/CombatController';

const router = Router();

// Routes pour les combats
router.post('/random-challenge', combatController.randomChallenge.bind(combatController));
router.post('/deterministic-challenge', combatController.deterministicChallenge.bind(combatController));
router.post('/arena1', combatController.arena1.bind(combatController));
router.post('/arena2', combatController.arena2.bind(combatController));

// Routes pour les soins et statistiques
router.post('/heal/:id', combatController.healTrainerPokemons.bind(combatController));
router.get('/stats/:id', combatController.getTrainerCombatStats.bind(combatController));

export default router;

