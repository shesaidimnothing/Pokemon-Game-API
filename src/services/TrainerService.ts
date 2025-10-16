import { databaseService } from './database';
import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
import { ITrainer } from '../types';

export class TrainerService {
  /**
   * Récupère tous les dresseurs
   */
  async getAllTrainers(): Promise<Trainer[]> {
    const query = `
      SELECT t.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', p.id,
                   'name', p.name,
                   'lifePoint', p.life_point,
                   'maxLifePoint', p.max_life_point,
                   'attacks', COALESCE(pa.attacks, '[]'::json)
                 )
               ) FILTER (WHERE p.id IS NOT NULL),
               '[]'::json
             ) as pokemons
      FROM trainers t
      LEFT JOIN pokemons p ON t.id = p.trainer_id
      LEFT JOIN (
        SELECT pa.pokemon_id,
               json_agg(
                 json_build_object(
                   'id', a.id,
                   'name', a.name,
                   'damage', a.damage,
                   'usageLimit', a.usage_limit,
                   'currentUsage', pa.current_usage
                 )
               ) as attacks
        FROM pokemon_attacks pa
        JOIN attacks a ON pa.attack_id = a.id
        GROUP BY pa.pokemon_id
      ) pa ON p.id = pa.pokemon_id
      GROUP BY t.id, t.name, t.level, t.experience
      ORDER BY t.name
    `;

    const result = await databaseService.query(query);
    return result.rows.map((row: any) => this.mapRowToTrainer(row));
  }

  /**
   * Récupère un dresseur par ID
   */
  async getTrainerById(id: number): Promise<Trainer | null> {
    const query = `
      SELECT t.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', p.id,
                   'name', p.name,
                   'lifePoint', p.life_point,
                   'maxLifePoint', p.max_life_point,
                   'attacks', COALESCE(pa.attacks, '[]'::json)
                 )
               ) FILTER (WHERE p.id IS NOT NULL),
               '[]'::json
             ) as pokemons
      FROM trainers t
      LEFT JOIN pokemons p ON t.id = p.trainer_id
      LEFT JOIN (
        SELECT pa.pokemon_id,
               json_agg(
                 json_build_object(
                   'id', a.id,
                   'name', a.name,
                   'damage', a.damage,
                   'usageLimit', a.usage_limit,
                   'currentUsage', pa.current_usage
                 )
               ) as attacks
        FROM pokemon_attacks pa
        JOIN attacks a ON pa.attack_id = a.id
        GROUP BY pa.pokemon_id
      ) pa ON p.id = pa.pokemon_id
      WHERE t.id = $1
      GROUP BY t.id, t.name, t.level, t.experience
    `;

    const result = await databaseService.query(query, [id]);
    if (result.rows.length === 0) return null;
    
    return this.mapRowToTrainer(result.rows[0]);
  }

  /**
   * Crée un nouveau dresseur
   */
  async createTrainer(trainerData: { name: string }): Promise<Trainer> {
    const query = `
      INSERT INTO trainers (name, level, experience) 
      VALUES ($1, 1, 0) 
      RETURNING id, name, level, experience
    `;

    const result = await databaseService.query(query, [trainerData.name]);
    const row = result.rows[0];
    
    return new Trainer(row.name, row.id);
  }

  /**
   * Met à jour un dresseur
   */
  async updateTrainer(id: number, trainerData: Partial<ITrainer>): Promise<Trainer | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (trainerData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(trainerData.name);
    }
    if (trainerData.level !== undefined) {
      fields.push(`level = $${paramCount++}`);
      values.push(trainerData.level);
    }
    if (trainerData.experience !== undefined) {
      fields.push(`experience = $${paramCount++}`);
      values.push(trainerData.experience);
    }

    if (fields.length === 0) {
      return this.getTrainerById(id);
    }

    values.push(id);
    const query = `
      UPDATE trainers 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, level, experience
    `;

    const result = await databaseService.query(query, values);
    if (result.rows.length === 0) return null;

    return this.getTrainerById(id);
  }

  /**
   * Supprime un dresseur
   */
  async deleteTrainer(id: number): Promise<boolean> {
    const query = 'DELETE FROM trainers WHERE id = $1';
    const result = await databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Ajoute un Pokémon à un dresseur
   */
  async addPokemonToTrainer(trainerId: number, pokemonData: { name: string; maxLifePoint: number }): Promise<Pokemon | null> {
    // Vérifier que le dresseur existe
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) return null;

    // Vérifier la limite de 6 Pokémon
    if (trainer.pokemons.length >= 6) {
      throw new Error('Le dresseur ne peut pas avoir plus de 6 Pokémon');
    }

    const query = `
      INSERT INTO pokemons (name, max_life_point, life_point, trainer_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, max_life_point, life_point
    `;

    const result = await databaseService.query(query, [
      pokemonData.name,
      pokemonData.maxLifePoint,
      pokemonData.maxLifePoint,
      trainerId
    ]);

    const row = result.rows[0];
    return new Pokemon(row.name, row.max_life_point, row.id);
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healAllPokemons(trainerId: number): Promise<boolean> {
    const query = `
      UPDATE pokemons 
      SET life_point = max_life_point 
      WHERE trainer_id = $1
    `;

    await databaseService.query(query, [trainerId]);

    // Réinitialiser les usages des attaques
    const resetAttacksQuery = `
      UPDATE pokemon_attacks 
      SET current_usage = 0 
      WHERE pokemon_id IN (SELECT id FROM pokemons WHERE trainer_id = $1)
    `;

    await databaseService.query(resetAttacksQuery, [trainerId]);
    return true;
  }

  /**
   * Convertit une ligne de base de données en objet Trainer
   */
  private mapRowToTrainer(row: any): Trainer {
    const trainer = new Trainer(row.name, row.id);
    trainer.level = row.level;
    trainer.experience = row.experience;

    if (row.pokemons && Array.isArray(row.pokemons)) {
      trainer.pokemons = row.pokemons.map((pokemonData: any) => {
        const pokemon = new Pokemon(pokemonData.name, pokemonData.maxLifePoint, pokemonData.id);
        pokemon.lifePoint = pokemonData.lifePoint;

        if (pokemonData.attacks && Array.isArray(pokemonData.attacks)) {
          pokemon.attacks = pokemonData.attacks.map((attackData: any) => {
            const attack = new Attack(attackData.name, attackData.damage, attackData.usageLimit, attackData.id);
            attack.currentUsage = attackData.currentUsage;
            return attack;
          });
        }

        return pokemon;
      });
    }

    return trainer;
  }
}

export const trainerService = new TrainerService();

