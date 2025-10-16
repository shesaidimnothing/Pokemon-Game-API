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

  /**
   * Ajoute un Pokémon au dresseur
   * @param pokemon Le Pokémon à ajouter
   * @returns true si le Pokémon a été ajouté, false sinon
   */
  public addPokemon(pokemon: Pokemon): boolean {
    if (this.pokemons.length >= 6) { // Limite de 6 Pokémon par dresseur
      return false;
    }
    this.pokemons.push(pokemon);
    return true;
  }

  /**
   * Soigne tous les Pokémon du dresseur à la taverne
   */
  public healAllPokemons(): void {
    this.pokemons.forEach(pokemon => pokemon.heal());
  }

  /**
   * Gagne de l'expérience et augmente de niveau si nécessaire
   * @param exp L'expérience à gagner
   */
  public gainExperience(exp: number): void {
    this.experience += exp;
    
    // Augmenter de niveau si l'expérience atteint 10
    while (this.experience >= 10) {
      this.level++;
      this.experience -= 10;
    }
  }

  /**
   * Obtient un Pokémon aléatoire vivant
   */
  public getRandomAlivePokemon(): Pokemon | null {
    const alivePokemons = this.pokemons.filter(pokemon => pokemon.isAlive());
    if (alivePokemons.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * alivePokemons.length);
    return alivePokemons[randomIndex];
  }

  /**
   * Obtient le Pokémon avec le plus de PV
   */
  public getPokemonWithMostHP(): Pokemon | null {
    const alivePokemons = this.pokemons.filter(pokemon => pokemon.isAlive());
    return Pokemon.getPokemonWithMostHP(alivePokemons);
  }

  /**
   * Vérifie si le dresseur a des Pokémon vivants
   */
  public hasAlivePokemons(): boolean {
    return this.pokemons.some(pokemon => pokemon.isAlive());
  }

  /**
   * Obtient le nombre de Pokémon vivants
   */
  public getAlivePokemonCount(): number {
    return this.pokemons.filter(pokemon => pokemon.isAlive()).length;
  }

  /**
   * Défi aléatoire : Deux dresseurs soignent leurs Pokémon, choisissent un Pokémon aléatoire et combattent
   * @param opponent Le dresseur adversaire
   * @returns Le résultat du combat
   */
  public randomChallenge(opponent: Trainer): ICombatResult {
    // Soigner tous les Pokémon
    this.healAllPokemons();
    opponent.healAllPokemons();

    // Choisir un Pokémon aléatoire pour chaque dresseur
    const myPokemon = this.getRandomAlivePokemon();
    const opponentPokemon = opponent.getRandomAlivePokemon();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  /**
   * Défi déterministe : Chaque dresseur choisit son Pokémon avec le plus de PV
   * @param opponent Le dresseur adversaire
   * @returns Le résultat du combat
   */
  public deterministicChallenge(opponent: Trainer): ICombatResult {
    // Ne pas soigner (combat sans taverne)
    const myPokemon = this.getPokemonWithMostHP();
    const opponentPokemon = opponent.getPokemonWithMostHP();

    if (!myPokemon || !opponentPokemon) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon vivant');
    }

    return this.fight(myPokemon, opponent, opponentPokemon);
  }

  /**
   * Combat entre deux Pokémon
   * @param myPokemon Mon Pokémon
   * @param opponent Le dresseur adversaire
   * @param opponentPokemon Le Pokémon de l'adversaire
   * @returns Le résultat du combat
   */
  private fight(myPokemon: Pokemon, opponent: Trainer, opponentPokemon: Pokemon): ICombatResult {
    const details: string[] = [];
    let rounds = 0;

    details.push(`Combat entre ${myPokemon.name} (${this.name}) et ${opponentPokemon.name} (${opponent.name})`);

    while (myPokemon.isAlive() && opponentPokemon.isAlive()) {
      rounds++;
      
      // Mon Pokémon attaque
      const damageDealt = myPokemon.attack(opponentPokemon);
      details.push(`Round ${rounds}: ${myPokemon.name} inflige ${damageDealt} dégâts à ${opponentPokemon.name} (PV: ${opponentPokemon.lifePoint})`);
      
      if (opponentPokemon.isKO()) {
        break;
      }

      // Le Pokémon adverse attaque
      const damageReceived = opponentPokemon.attack(myPokemon);
      details.push(`Round ${rounds}: ${opponentPokemon.name} inflige ${damageReceived} dégâts à ${myPokemon.name} (PV: ${myPokemon.lifePoint})`);
    }

    const winner = myPokemon.isAlive() ? this : opponent;
    const loser = myPokemon.isAlive() ? opponent : this;

    // Le gagnant gagne de l'expérience
    winner.gainExperience(1);

    details.push(`Le gagnant est ${winner.name} !`);

    return {
      winner,
      loser,
      rounds,
      details
    };
  }

  /**
   * Arène 1 : 100 combats aléatoires successifs
   * @param opponent Le dresseur adversaire
   * @returns Le résultat de l'arène
   */
  public arena1(opponent: Trainer): IArenaResult {
    const results: ICombatResult[] = [];
    let myWins = 0;
    let opponentWins = 0;

    for (let i = 0; i < 100; i++) {
      try {
        const result = this.randomChallenge(opponent);
        results.push(result);
        
        if (result.winner === this) {
          myWins++;
        } else {
          opponentWins++;
        }
      } catch (error) {
        // Si un dresseur n'a plus de Pokémon, arrêter l'arène
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

  /**
   * Arène 2 : 100 combats déterministes consécutifs
   * @param opponent Le dresseur adversaire
   * @returns Le résultat de l'arène
   */
  public arena2(opponent: Trainer): IArenaResult {
    const results: ICombatResult[] = [];

    for (let i = 0; i < 100; i++) {
      try {
        const result = this.deterministicChallenge(opponent);
        results.push(result);
        
        // Arrêter si un dresseur perd tous ses Pokémon
        if (!this.hasAlivePokemons() || !opponent.hasAlivePokemons()) {
          break;
        }
      } catch (error) {
        // Si un dresseur n'a plus de Pokémon, arrêter l'arène
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

  /**
   * Affiche les informations du dresseur
   */
  public displayInfo(): string {
    const pokemonsInfo = this.pokemons.map(pokemon => `  - ${pokemon.name} (PV: ${pokemon.lifePoint}/${pokemon.maxLifePoint})`).join('\n');
    return `Dresseur: ${this.name}\nNiveau: ${this.level}\nExpérience: ${this.experience}\nPokémon:\n${pokemonsInfo}`;
  }

  /**
   * Crée une copie du dresseur
   */
  public clone(): Trainer {
    const clonedTrainer = new Trainer(this.name, this.id);
    clonedTrainer.level = this.level;
    clonedTrainer.experience = this.experience;
    clonedTrainer.pokemons = this.pokemons.map(pokemon => pokemon.clone());
    return clonedTrainer;
  }
}

