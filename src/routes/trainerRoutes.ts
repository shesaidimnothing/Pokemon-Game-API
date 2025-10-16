import { Router } from 'express';
import { trainerController } from '../controllers/TrainerController';

const router = Router();

// Routes pour les dresseurs
router.get('/', trainerController.getAllTrainers.bind(trainerController));
router.get('/:id', trainerController.getTrainerById.bind(trainerController));
router.post('/', trainerController.createTrainer.bind(trainerController));
router.put('/:id', trainerController.updateTrainer.bind(trainerController));
router.delete('/:id', trainerController.deleteTrainer.bind(trainerController));

// Routes pour les Pokémon des dresseurs
router.post('/:id/pokemons', trainerController.addPokemonToTrainer.bind(trainerController));
router.post('/:id/heal', trainerController.healAllPokemons.bind(trainerController));

export default router;

