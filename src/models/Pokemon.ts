import { IPokemon } from '../types';
import { Attack } from './Attack';

export class Pokemon implements IPokemon {
  public id?: number;
  public name: string;
  public lifePoint: number;
  public maxLifePoint: number;
  public attacks: Attack[];

  constructor(name: string, maxLifePoint: number, id?: number) {
    this.id = id;
    this.name = name;
    this.maxLifePoint = maxLifePoint;
    this.lifePoint = maxLifePoint;
    this.attacks = [];
  }

  /**
   * Apprend une nouvelle attaque (max 4 attaques, sans doublon)
   * @param attack L'attaque à apprendre
   * @returns true si l'attaque a été apprise, false sinon
   */
  public learnAttack(attack: Attack): boolean {
    // Vérifier si le Pokémon a déjà 4 attaques
    if (this.attacks.length >= 4) {
      return false;
    }

    // Vérifier si l'attaque existe déjà
    const existingAttack = this.attacks.find(a => a.name === attack.name);
    if (existingAttack) {
      return false;
    }

    // Ajouter l'attaque
    this.attacks.push(attack.clone());
    return true;
  }

  /**
   * Soigne le Pokémon (restaure ses PV et réinitialise les usages des attaques)
   */
  public heal(): void {
    this.lifePoint = this.maxLifePoint;
    this.attacks.forEach(attack => attack.resetUsage());
  }

  /**
   * Attaque un autre Pokémon de façon aléatoire avec l'une de ses attaques disponibles
   * @param target Le Pokémon cible
   * @returns Les dégâts infligés, ou 0 si aucune attaque disponible
   */
  public attack(target: Pokemon): number {
    // Trouver les attaques disponibles
    const availableAttacks = this.attacks.filter(attack => attack.canUse());
    
    if (availableAttacks.length === 0) {
      return 0;
    }

    // Choisir une attaque aléatoire
    const randomIndex = Math.floor(Math.random() * availableAttacks.length);
    const selectedAttack = availableAttacks[randomIndex];

    // Utiliser l'attaque
    if (selectedAttack.use()) {
      const damage = selectedAttack.damage;
      target.takeDamage(damage);
      return damage;
    }

    return 0;
  }

  /**
   * Inflige des dégâts au Pokémon
   * @param damage Les dégâts à infliger
   */
  public takeDamage(damage: number): void {
    this.lifePoint = Math.max(0, this.lifePoint - damage);
  }

  /**
   * Vérifie si le Pokémon est KO (points de vie à 0)
   */
  public isKO(): boolean {
    return this.lifePoint <= 0;
  }

  /**
   * Vérifie si le Pokémon est vivant
   */
  public isAlive(): boolean {
    return this.lifePoint > 0;
  }

  /**
   * Obtient les attaques disponibles
   */
  public getAvailableAttacks(): Attack[] {
    return this.attacks.filter(attack => attack.canUse());
  }

  /**
   * Obtient le Pokémon avec le plus de PV
   */
  public static getPokemonWithMostHP(pokemons: Pokemon[]): Pokemon | null {
    if (pokemons.length === 0) return null;
    
    return pokemons.reduce((max, current) => 
      current.lifePoint > max.lifePoint ? current : max
    );
  }

  /**
   * Affiche les informations du Pokémon
   */
  public displayInfo(): string {
    const attacksInfo = this.attacks.map(attack => attack.displayInfo()).join('\n  ');
    return `Pokémon: ${this.name}\nPV: ${this.lifePoint}/${this.maxLifePoint}\nAttaques:\n  ${attacksInfo}`;
  }

  /**
   * Crée une copie du Pokémon
   */
  public clone(): Pokemon {
    const clonedPokemon = new Pokemon(this.name, this.maxLifePoint, this.id);
    clonedPokemon.lifePoint = this.lifePoint;
    clonedPokemon.attacks = this.attacks.map(attack => attack.clone());
    return clonedPokemon;
  }
}

