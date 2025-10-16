import { mockDatabaseService } from './mockDatabase';
import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
import { ITrainer } from '../types';

export class MockTrainerService {
  /**
   * Récupère tous les dresseurs
   */
  async getAllTrainers(): Promise<Trainer[]> {
    return await mockDatabaseService.getAllTrainers();
  }

  /**
   * Récupère un dresseur par ID
   */
  async getTrainerById(id: number): Promise<Trainer | null> {
    return await mockDatabaseService.getTrainerById(id);
  }

  /**
   * Crée un nouveau dresseur
   */
  async createTrainer(trainerData: { name: string }): Promise<Trainer> {
    return await mockDatabaseService.createTrainer(trainerData);
  }

  /**
   * Met à jour un dresseur
   */
  async updateTrainer(id: number, trainerData: Partial<ITrainer>): Promise<Trainer | null> {
    return await mockDatabaseService.updateTrainer(id, trainerData);
  }

  /**
   * Supprime un dresseur
   */
  async deleteTrainer(id: number): Promise<boolean> {
    return await mockDatabaseService.deleteTrainer(id);
  }

  /**
   * Ajoute un Pokémon à un dresseur
   */
  async addPokemonToTrainer(trainerId: number, pokemonData: { name: string; maxLifePoint: number }): Promise<Pokemon | null> {
    return await mockDatabaseService.addPokemonToTrainer(trainerId, pokemonData);
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healAllPokemons(trainerId: number): Promise<boolean> {
    return await mockDatabaseService.healAllPokemons(trainerId);
  }
}

export const mockTrainerService = new MockTrainerService();
