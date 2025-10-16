import { Router } from 'express';
import { mockCombatController } from '../controllers/MockCombatController';

const router = Router();

// Routes pour les combats
router.post('/random-challenge', mockCombatController.randomChallenge.bind(mockCombatController));
router.post('/deterministic-challenge', mockCombatController.deterministicChallenge.bind(mockCombatController));
router.post('/arena1', mockCombatController.arena1.bind(mockCombatController));
router.post('/arena2', mockCombatController.arena2.bind(mockCombatController));

// Routes pour les soins et statistiques
router.post('/heal/:id', mockCombatController.healTrainerPokemons.bind(mockCombatController));
router.get('/stats/:id', mockCombatController.getTrainerCombatStats.bind(mockCombatController));

export default router;
