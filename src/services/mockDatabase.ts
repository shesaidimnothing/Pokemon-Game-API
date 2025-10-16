import { IAttack, IPokemon, ITrainer } from '../types';
import { Attack } from '../models/Attack';
import { Pokemon } from '../models/Pokemon';
import { Trainer } from '../models/Trainer';

class MockDatabaseService {
  private trainers: Map<number, Trainer> = new Map();
  private attacks: Map<number, Attack> = new Map();
  private pokemons: Map<number, Pokemon> = new Map();
  private nextId = 1;

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialise les données de test
   */
  private initializeMockData(): void {
    // Créer des attaques de base
    const attackData = [
      { name: 'Tackle', damage: 10, usage_limit: 5 },
      { name: 'Ember', damage: 15, usage_limit: 3 },
      { name: 'Water Gun', damage: 12, usage_limit: 4 },
      { name: 'Thunder Shock', damage: 14, usage_limit: 3 },
      { name: 'Vine Whip', damage: 11, usage_limit: 4 },
      { name: 'Quick Attack', damage: 8, usage_limit: 6 },
      { name: 'Flamethrower', damage: 25, usage_limit: 2 },
      { name: 'Hydro Pump', damage: 22, usage_limit: 2 },
      { name: 'Thunderbolt', damage: 20, usage_limit: 2 },
      { name: 'Solar Beam', damage: 30, usage_limit: 1 }
    ];

    attackData.forEach(attack => {
      const newAttack = new Attack(attack.name, attack.damage, attack.usage_limit, this.nextId++);
      this.attacks.set(newAttack.id!, newAttack);
    });

    // Créer des dresseurs de test
    const trainerData = [
      { name: 'Ash', level: 5, experience: 3 },
      { name: 'Misty', level: 4, experience: 7 },
      { name: 'Brock', level: 6, experience: 1 }
    ];

    trainerData.forEach(trainer => {
      const newTrainer = new Trainer(trainer.name, this.nextId++);
      newTrainer.level = trainer.level;
      newTrainer.experience = trainer.experience;
      this.trainers.set(newTrainer.id!, newTrainer);
    });

    // Créer des Pokémon de test
    const pokemonData = [
      { name: 'Pikachu', max_life_point: 100, trainer_name: 'Ash' },
      { name: 'Charmander', max_life_point: 90, trainer_name: 'Ash' },
      { name: 'Squirtle', max_life_point: 95, trainer_name: 'Misty' },
      { name: 'Staryu', max_life_point: 85, trainer_name: 'Misty' },
      { name: 'Onix', max_life_point: 120, trainer_name: 'Brock' },
      { name: 'Geodude', max_life_point: 80, trainer_name: 'Brock' }
    ];

    pokemonData.forEach(pokemon => {
      const trainer = Array.from(this.trainers.values()).find(t => t.name === pokemon.trainer_name);
      if (trainer) {
        const newPokemon = new Pokemon(pokemon.name, pokemon.max_life_point, this.nextId++);
        trainer.addPokemon(newPokemon);
        this.pokemons.set(newPokemon.id!, newPokemon);

        // Assigner des attaques aléatoires
        const randomAttacks = Array.from(this.attacks.values()).sort(() => 0.5 - Math.random()).slice(0, 4);
        randomAttacks.forEach(attack => {
          newPokemon.learnAttack(attack);
        });
      }
    });

    console.log('✅ Données de test initialisées (mode mock)');
  }

  /**
   * Récupère tous les dresseurs
   */
  async getAllTrainers(): Promise<Trainer[]> {
    return Array.from(this.trainers.values());
  }

  /**
   * Récupère un dresseur par ID
   */
  async getTrainerById(id: number): Promise<Trainer | null> {
    return this.trainers.get(id) || null;
  }

  /**
   * Crée un nouveau dresseur
   */
  async createTrainer(trainerData: { name: string }): Promise<Trainer> {
    const trainer = new Trainer(trainerData.name, this.nextId++);
    this.trainers.set(trainer.id!, trainer);
    return trainer;
  }

  /**
   * Met à jour un dresseur
   */
  async updateTrainer(id: number, trainerData: Partial<ITrainer>): Promise<Trainer | null> {
    const trainer = this.trainers.get(id);
    if (!trainer) return null;

    if (trainerData.name !== undefined) trainer.name = trainerData.name;
    if (trainerData.level !== undefined) trainer.level = trainerData.level;
    if (trainerData.experience !== undefined) trainer.experience = trainerData.experience;

    return trainer;
  }

  /**
   * Supprime un dresseur
   */
  async deleteTrainer(id: number): Promise<boolean> {
    return this.trainers.delete(id);
  }

  /**
   * Ajoute un Pokémon à un dresseur
   */
  async addPokemonToTrainer(trainerId: number, pokemonData: { name: string; maxLifePoint: number }): Promise<Pokemon | null> {
    const trainer = this.trainers.get(trainerId);
    if (!trainer) return null;

    if (trainer.pokemons.length >= 6) {
      throw new Error('Le dresseur ne peut pas avoir plus de 6 Pokémon');
    }

    const pokemon = new Pokemon(pokemonData.name, pokemonData.maxLifePoint, this.nextId++);
    trainer.addPokemon(pokemon);
    this.pokemons.set(pokemon.id!, pokemon);
    return pokemon;
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healAllPokemons(trainerId: number): Promise<boolean> {
    const trainer = this.trainers.get(trainerId);
    if (!trainer) return false;

    trainer.healAllPokemons();
    return true;
  }

  /**
   * Ferme la connexion (pas nécessaire en mode mock)
   */
  async close(): Promise<void> {
    console.log('Mock database closed');
  }
}

export const mockDatabaseService = new MockDatabaseService();
