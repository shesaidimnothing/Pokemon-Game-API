import { Router } from 'express';
import { mockTrainerController } from '../controllers/MockTrainerController';

const router = Router();

// Routes pour les dresseurs
router.get('/', mockTrainerController.getAllTrainers.bind(mockTrainerController));
router.get('/:id', mockTrainerController.getTrainerById.bind(mockTrainerController));
router.post('/', mockTrainerController.createTrainer.bind(mockTrainerController));
router.put('/:id', mockTrainerController.updateTrainer.bind(mockTrainerController));
router.delete('/:id', mockTrainerController.deleteTrainer.bind(mockTrainerController));

// Routes pour les Pokémon des dresseurs
router.post('/:id/pokemons', mockTrainerController.addPokemonToTrainer.bind(mockTrainerController));
router.post('/:id/heal', mockTrainerController.healAllPokemons.bind(mockTrainerController));

export default router;
