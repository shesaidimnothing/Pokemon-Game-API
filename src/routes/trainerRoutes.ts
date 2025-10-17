import { Router } from 'express';
import { trainerController } from '../controllers/TrainerController';

const router = Router();

router.get('/attacks', trainerController.getAllAttacks.bind(trainerController));

router.get('/', trainerController.getAllTrainers.bind(trainerController));
router.get('/:id', trainerController.getTrainerById.bind(trainerController));
router.post('/', trainerController.createTrainer.bind(trainerController));
router.put('/:id', trainerController.updateTrainer.bind(trainerController));
router.delete('/:id', trainerController.deleteTrainer.bind(trainerController));

router.post('/:id/pokemons', trainerController.addPokemonToTrainer.bind(trainerController));
router.post('/:id/heal', trainerController.healAllPokemons.bind(trainerController));

router.post('/:trainerId/pokemons/:pokemonId/attacks', trainerController.addAttackToPokemon.bind(trainerController));
router.delete('/:trainerId/pokemons/:pokemonId/attacks/:attackId', trainerController.removeAttackFromPokemon.bind(trainerController));

export default router;