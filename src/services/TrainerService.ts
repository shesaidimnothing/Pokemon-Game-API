import { databaseService } from './database';
import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
import { ITrainer } from '../types';

export class TrainerService {
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

  async deleteTrainer(id: number): Promise<boolean> {
    const query = 'DELETE FROM trainers WHERE id = $1';
    const result = await databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async addPokemonToTrainer(trainerId: number, pokemonData: { name: string; maxLifePoint: number }): Promise<Pokemon | null> {
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) return null;

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

  async healAllPokemons(trainerId: number): Promise<boolean> {
    const query = `
      UPDATE pokemons 
      SET life_point = max_life_point 
      WHERE trainer_id = $1
    `;

    await databaseService.query(query, [trainerId]);

    const resetAttacksQuery = `
      UPDATE pokemon_attacks 
      SET current_usage = 0 
      WHERE pokemon_id IN (SELECT id FROM pokemons WHERE trainer_id = $1)
    `;

    await databaseService.query(resetAttacksQuery, [trainerId]);
    return true;
  }

  async getAllAttacks(): Promise<Attack[]> {
    const query = 'SELECT * FROM attacks ORDER BY name';
    const result = await databaseService.query(query);
    return result.rows.map((row: any) => new Attack(row.name, row.damage, row.usage_limit, row.id));
  }

  async addAttackToPokemon(trainerId: number, pokemonId: number, attackId: number): Promise<Trainer | null> {
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) return null;

    const pokemon = trainer.pokemons.find(p => p.id === pokemonId);
    if (!pokemon) return null;

    if (pokemon.attacks.length >= 4) {
      throw new Error('Le Pokémon ne peut pas avoir plus de 4 attaques');
    }

    if (pokemon.attacks.some(attack => attack.id === attackId)) {
      throw new Error('Le Pokémon connaît déjà cette attaque');
    }

    const attackQuery = 'SELECT * FROM attacks WHERE id = $1';
    const attackResult = await databaseService.query(attackQuery, [attackId]);
    if (attackResult.rows.length === 0) return null;

    const attackData = attackResult.rows[0];

    const insertQuery = `
      INSERT INTO pokemon_attacks (pokemon_id, attack_id, current_usage) 
      VALUES ($1, $2, 0)
    `;
    await databaseService.query(insertQuery, [pokemonId, attackId]);

    return this.getTrainerById(trainerId);
  }

  async removeAttackFromPokemon(trainerId: number, pokemonId: number, attackId: number): Promise<boolean> {
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) return false;

    const pokemon = trainer.pokemons.find(p => p.id === pokemonId);
    if (!pokemon) return false;

    const deleteQuery = `
      DELETE FROM pokemon_attacks 
      WHERE pokemon_id = $1 AND attack_id = $2
    `;
    const result = await databaseService.query(deleteQuery, [pokemonId, attackId]);
    
    return result.rowCount > 0;
  }

  async savePokemonHP(trainerId: number, pokemons: Pokemon[]): Promise<void> {
    for (const pokemon of pokemons) {
      if (pokemon.id) {
        const query = `
          UPDATE pokemons 
          SET life_point = $1 
          WHERE id = $2
        `;
        await databaseService.query(query, [pokemon.lifePoint, pokemon.id]);
      }
    }
  }

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