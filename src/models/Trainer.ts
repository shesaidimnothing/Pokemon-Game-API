import { ITrainer, ICombatResult, IArenaResult } from '../types';
import { Pokemon } from './Pokemon';
import { Attack } from './Attack';

export class Trainer implements ITrainer {
  public id?: number;
  public name: string;
  public level: number;
  public experience: number;
  public pokemons: Pokemon[];

  constructor(name: string, id?: number) {
    this.id = id;
    this.name = name;
    this.level = 1;
    this.experience = 0;
    this.pokemons = [];
  }

  public addPokemon(pokemon: Pokemon): boolean {
    if (this.pokemons.length >= 6) {
      return false;
    }
    this.pokemons.push(pokemon);
    return true;
  }

  public healAllPokemons(): void {
    this.pokemons.forEach(pokemon => pokemon.heal());
  }

  public gainExperience(exp: number): void {
    this.experience += exp;
    
    while (this.experience >= 10) {
      this.level++;
      this.experience -= 10;
    }
  }

  public getRandomAlivePokemon(): Pokemon | null {
    const alivePokemons = this.pokemons.filter(pokemon => pokemon.isAlive());
    if (alivePokemons.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * alivePokemons.length);
    return alivePokemons[randomIndex];
  }

  public getPokemonWithMostHP(): Pokemon | null {
    const alivePokemons = this.pokemons.filter(pokemon => pokemon.isAlive());
    return Pokemon.getPokemonWithMostHP(alivePokemons);
  }

  public hasAlivePokemons(): boolean {
    return this.pokemons.some(pokemon => pokemon.isAlive());
  }

  public getAlivePokemonCount(): number {
    return this.pokemons.filter(pokemon => pokemon.isAlive()).length;
  }

  public randomChallenge(opponent: Trainer): ICombatResult {
    this.healAllPokemons();
    opponent.healAllPokemons();

    const myPokemon = this.getRandomAlivePokemon();
    const opponentPokemon = opponent.getRandomAlivePokemon();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  public deterministicChallenge(opponent: Trainer): ICombatResult {
    const myPokemon = this.getPokemonWithMostHP();
    const opponentPokemon = opponent.getPokemonWithMostHP();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  public arenaRandomChallenge(opponent: Trainer): ICombatResult {
    const myPokemon = this.getRandomAlivePokemon();
    const opponentPokemon = opponent.getRandomAlivePokemon();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  public arenaDeterministicChallenge(opponent: Trainer): ICombatResult {
    const myPokemon = this.getPokemonWithMostHP();
    const opponentPokemon = opponent.getPokemonWithMostHP();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  private fight(myPokemon: Pokemon, opponent: Trainer, opponentPokemon: Pokemon): ICombatResult {
    const details: string[] = [];
    let rounds = 0;

    details.push(`Combat entre ${myPokemon.name} (${this.name}) et ${opponentPokemon.name} (${opponent.name})`);

    while (myPokemon.isAlive() && opponentPokemon.isAlive()) {
      rounds++;
      
      const damageDealt = myPokemon.attack(opponentPokemon);
      details.push(`Round ${rounds}: ${myPokemon.name} inflige ${damageDealt} dégâts à ${opponentPokemon.name} (PV: ${opponentPokemon.lifePoint})`);
      
      if (opponentPokemon.isKO()) {
        break;
      }

      const damageReceived = opponentPokemon.attack(myPokemon);
      details.push(`Round ${rounds}: ${opponentPokemon.name} inflige ${damageReceived} dégâts à ${myPokemon.name} (PV: ${myPokemon.lifePoint})`);
    }

    const winner = myPokemon.isAlive() ? this : opponent;
    const loser = myPokemon.isAlive() ? opponent : this;

    winner.gainExperience(1);

    details.push(`Le gagnant est ${winner.name} !`);

    return {
      winner,
      loser,
      rounds,
      details
    };
  }

  public arena1(opponent: Trainer): IArenaResult {
    const results: ICombatResult[] = [];
    let myWins = 0;
    let opponentWins = 0;

    for (let i = 0; i < 100; i++) {
      try {
        const result = this.arenaRandomChallenge(opponent);
        results.push(result);
        
        if (result.winner === this) {
          myWins++;
        } else {
          opponentWins++;
        }
      } catch (error) {
        break;
      }
    }

    const winner = myWins > opponentWins ? this : 
                   opponentWins > myWins ? opponent : 
                   (this.level > opponent.level ? this : 
                    this.level < opponent.level ? opponent :
                    (this.experience > opponent.experience ? this : opponent));

    return {
      winner,
      totalBattles: results.length,
      results
    };
  }

  public arena2(opponent: Trainer): IArenaResult {
    const results: ICombatResult[] = [];

    for (let i = 0; i < 100; i++) {
      try {
        const result = this.arenaDeterministicChallenge(opponent);
        results.push(result);
        
        if (!this.hasAlivePokemons() || !opponent.hasAlivePokemons()) {
          break;
        }
      } catch (error) {
        break;
      }
    }

    const winner = this.hasAlivePokemons() ? this : opponent;

    return {
      winner,
      totalBattles: results.length,
      results
    };
  }

  public displayInfo(): string {
    const pokemonsInfo = this.pokemons.map(pokemon => `  - ${pokemon.name} (PV: ${pokemon.lifePoint}/${pokemon.maxLifePoint})`).join('\n');
    return `Dresseur: ${this.name}\nNiveau: ${this.level}\nExpérience: ${this.experience}\nPokémon:\n${pokemonsInfo}`;
  }

  public clone(): Trainer {
    const clonedTrainer = new Trainer(this.name, this.id);
    clonedTrainer.level = this.level;
    clonedTrainer.experience = this.experience;
    clonedTrainer.pokemons = this.pokemons.map(pokemon => pokemon.clone());
    return clonedTrainer;
  }
}