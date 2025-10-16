import { mockTrainerService } from './MockTrainerService';
import { Trainer } from '../models/Trainer';
import { ICombatResult, IArenaResult } from '../types';

export class MockCombatService {
  /**
   * Défi aléatoire entre deux dresseurs
   */
  async randomChallenge(trainer1Id: number, trainer2Id: number): Promise<ICombatResult> {
    const trainer1 = await mockTrainerService.getTrainerById(trainer1Id);
    const trainer2 = await mockTrainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    if (!trainer1.hasAlivePokemons() || !trainer2.hasAlivePokemons()) {
      throw new Error('Un ou plusieurs dresseurs n\'ont pas de Pokémon vivant');
    }

    const result = trainer1.randomChallenge(trainer2);

    // Sauvegarder les changements d'expérience
    await mockTrainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await mockTrainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  /**
   * Défi déterministe entre deux dresseurs
   */
  async deterministicChallenge(trainer1Id: number, trainer2Id: number): Promise<ICombatResult> {
    const trainer1 = await mockTrainerService.getTrainerById(trainer1Id);
    const trainer2 = await mockTrainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    if (!trainer1.hasAlivePokemons() || !trainer2.hasAlivePokemons()) {
      throw new Error('Un ou plusieurs dresseurs n\'ont pas de Pokémon vivant');
    }

    const result = trainer1.deterministicChallenge(trainer2);

    // Sauvegarder les changements d'expérience
    await mockTrainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await mockTrainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  /**
   * Arène 1 : 100 combats aléatoires successifs
   */
  async arena1(trainer1Id: number, trainer2Id: number): Promise<IArenaResult> {
    const trainer1 = await mockTrainerService.getTrainerById(trainer1Id);
    const trainer2 = await mockTrainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    const result = trainer1.arena1(trainer2);

    // Sauvegarder les changements d'expérience
    await mockTrainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await mockTrainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  /**
   * Arène 2 : 100 combats déterministes consécutifs
   */
  async arena2(trainer1Id: number, trainer2Id: number): Promise<IArenaResult> {
    const trainer1 = await mockTrainerService.getTrainerById(trainer1Id);
    const trainer2 = await mockTrainerService.getTrainerById(trainer2Id);

    if (!trainer1 || !trainer2) {
      throw new Error('Un ou plusieurs dresseurs introuvables');
    }

    const result = trainer1.arena2(trainer2);

    // Sauvegarder les changements d'expérience
    await mockTrainerService.updateTrainer(trainer1Id, {
      level: trainer1.level,
      experience: trainer1.experience
    });

    await mockTrainerService.updateTrainer(trainer2Id, {
      level: trainer2.level,
      experience: trainer2.experience
    });

    return result;
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healTrainerPokemons(trainerId: number): Promise<boolean> {
    return await mockTrainerService.healAllPokemons(trainerId);
  }

  /**
   * Obtient les statistiques de combat d'un dresseur
   */
  async getTrainerCombatStats(trainerId: number): Promise<{
    trainer: Trainer;
    alivePokemonCount: number;
    totalPokemonCount: number;
    averagePokemonHP: number;
  }> {
    const trainer = await mockTrainerService.getTrainerById(trainerId);
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

export const mockCombatService = new MockCombatService();
