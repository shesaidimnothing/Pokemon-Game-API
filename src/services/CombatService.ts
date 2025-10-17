import { trainerService } from './TrainerService';
import { Trainer } from '../models/Trainer';
import { ICombatResult, IArenaResult } from '../types';

export class CombatService {
  async randomChallenge(trainer1Id: number, trainer2Id: number): Promise<ICombatResult> {
    const trainer1 = await trainerService.getTrainerById(trainer1Id);
    const trainer2 = await trainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    if (!trainer1.hasAlivePokemons() || !trainer2.hasAlivePokemons()) {
      throw new Error('Un ou plusieurs dresseurs n\'ont pas de Pokémon vivant');
    }

    const result = trainer1.randomChallenge(trainer2);

    await trainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await trainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  async deterministicChallenge(trainer1Id: number, trainer2Id: number): Promise<ICombatResult> {
    const trainer1 = await trainerService.getTrainerById(trainer1Id);
    const trainer2 = await trainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    if (!trainer1.hasAlivePokemons() || !trainer2.hasAlivePokemons()) {
      throw new Error('Un ou plusieurs dresseurs n\'ont pas de Pokémon vivant');
    }

    const result = trainer1.deterministicChallenge(trainer2);

    await trainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await trainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  async arena1(trainer1Id: number, trainer2Id: number): Promise<IArenaResult> {
    const trainer1 = await trainerService.getTrainerById(trainer1Id);
    const trainer2 = await trainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    const result = trainer1.arena1(trainer2);

    await trainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await trainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    await trainerService.savePokemonHP(trainer1Id, trainer1.pokemons);
    await trainerService.savePokemonHP(trainer2Id, trainer2.pokemons);

    return result;
  }

  async arena2(trainer1Id: number, trainer2Id: number): Promise<IArenaResult> {
    const trainer1 = await trainerService.getTrainerById(trainer1Id);
    const trainer2 = await trainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    const result = trainer1.arena2(trainer2);

    await trainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await trainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    await trainerService.savePokemonHP(trainer1Id, trainer1.pokemons);
    await trainerService.savePokemonHP(trainer2Id, trainer2.pokemons);

    return result;
  }

  async healTrainerPokemons(trainerId: number): Promise<boolean> {
    return await trainerService.healAllPokemons(trainerId);
  }

  async getTrainerCombatStats(trainerId: number): Promise<{
    trainer: Trainer;
    alivePokemonCount: number;
    totalPokemonCount: number;
    averagePokemonHP: number;
  }> {
    const trainer = await trainerService.getTrainerById(trainerId);
    if (!trainer) {
      throw new Error('Dresseur introuvable');
    }

    const alivePokemonCount = trainer.getAlivePokemonCount();
    const totalPokemonCount = trainer.pokemons.length;
    const averagePokemonHP = totalPokemonCount > 0 
      ? trainer.pokemons.reduce((sum, pokemon) => sum + pokemon.lifePoint, 0) / totalPokemonCount
      : 0;

    return {
      trainer,
      alivePokemonCount,
      totalPokemonCount,
      averagePokemonHP: Math.round(averagePokemonHP * 100) / 100
    };
  }
}

export const combatService = new CombatService();