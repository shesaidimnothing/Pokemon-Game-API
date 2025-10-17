import { Router } from 'express';
import { combatController } from '../controllers/CombatController';

const router = Router();

router.post('/random-challenge', combatController.randomChallenge.bind(combatController));
router.post('/deterministic-challenge', combatController.deterministicChallenge.bind(combatController));
router.post('/arena1', combatController.arena1.bind(combatController));
router.post('/arena2', combatController.arena2.bind(combatController));

router.post('/heal/:id', combatController.healTrainerPokemons.bind(combatController));
router.get('/stats/:id', combatController.getTrainerCombatStats.bind(combatController));

export default router;