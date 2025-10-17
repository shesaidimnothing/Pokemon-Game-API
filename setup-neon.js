const { Pool } = require('pg');
require('dotenv').config({ path: './neon-config.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
});

async function setupNeonDatabase() {
  try {
    console.log('🔌 Connexion à Neon...');
    
    const client = await pool.connect();
    console.log('✅ Connexion à Neon réussie !');
    
    console.log('📋 Création des tables...');
    
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS attacks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        damage INTEGER NOT NULL CHECK (damage > 0),
        usage_limit INTEGER NOT NULL CHECK (usage_limit > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trainers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
        experience INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pokemons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        max_life_point INTEGER NOT NULL CHECK (max_life_point > 0),
        life_point INTEGER NOT NULL CHECK (life_point > 0),
        trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pokemon_attacks (
        id SERIAL PRIMARY KEY,
        pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
        attack_id INTEGER REFERENCES attacks(id) ON DELETE CASCADE,
        current_usage INTEGER NOT NULL DEFAULT 0 CHECK (current_usage >= 0),
        UNIQUE(pokemon_id, attack_id)
      );

      CREATE INDEX IF NOT EXISTS idx_pokemons_trainer_id ON pokemons(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_pokemon_attacks_pokemon_id ON pokemon_attacks(pokemon_id);
      CREATE INDEX IF NOT EXISTS idx_pokemon_attacks_attack_id ON pokemon_attacks(attack_id);
    `;

    await client.query(createTablesQuery);
    console.log('✅ Tables créées avec succès !');
    
    const trainerCount = await client.query('SELECT COUNT(*) FROM trainers');
    if (parseInt(trainerCount.rows[0].count) > 0) {
      console.log('ℹ️  Des données existent déjà, pas d\'insertion de données de test');
    } else {
      console.log('🌱 Insertion des données de test...');
      
      const attacks = [
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

      for (const attack of attacks) {
        await client.query(
          'INSERT INTO attacks (name, damage, usage_limit) VALUES ($1, $2, $3)',
          [attack.name, attack.damage, attack.usage_limit]
        );
      }

      const trainers = [
        { name: 'Ash', level: 5, experience: 3 },
        { name: 'Misty', level: 4, experience: 7 },
        { name: 'Brock', level: 6, experience: 1 }
      ];

      for (const trainer of trainers) {
        await client.query(
          'INSERT INTO trainers (name, level, experience) VALUES ($1, $2, $3)',
          [trainer.name, trainer.level, trainer.experience]
        );
      }

      const attackIds = await client.query('SELECT id, name FROM attacks');
      const trainerIds = await client.query('SELECT id, name FROM trainers');

      const pokemons = [
        { name: 'Pikachu', max_life_point: 100, trainer_name: 'Ash' },
        { name: 'Charmander', max_life_point: 90, trainer_name: 'Ash' },
        { name: 'Squirtle', max_life_point: 95, trainer_name: 'Misty' },
        { name: 'Staryu', max_life_point: 85, trainer_name: 'Misty' },
        { name: 'Onix', max_life_point: 120, trainer_name: 'Brock' },
        { name: 'Geodude', max_life_point: 80, trainer_name: 'Brock' }
      ];

      for (const pokemon of pokemons) {
        const trainer = trainerIds.rows.find(t => t.name === pokemon.trainer_name);
        if (trainer) {
          const result = await client.query(
            'INSERT INTO pokemons (name, max_life_point, life_point, trainer_id) VALUES ($1, $2, $3, $4) RETURNING id',
            [pokemon.name, pokemon.max_life_point, pokemon.max_life_point, trainer.id]
          );
          
          const pokemonId = result.rows[0].id;
          
          const randomAttacks = attackIds.rows.sort(() => 0.5 - Math.random()).slice(0, 4);
          for (const attack of randomAttacks) {
            await client.query(
              'INSERT INTO pokemon_attacks (pokemon_id, attack_id, current_usage) VALUES ($1, $2, 0)',
              [pokemonId, attack.id]
            );
          }
        }
      }

      console.log('✅ Données de test insérées avec succès !');
    }
    
    client.release();
    console.log('🎉 Configuration Neon terminée !');
    console.log('🚀 Vous pouvez maintenant démarrer l\'API avec: npm run dev');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration Neon:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupNeonDatabase();