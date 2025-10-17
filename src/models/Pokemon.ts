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

  public learnAttack(attack: Attack): boolean {
    if (this.attacks.length >= 4) {
      return false;
    }

    const existingAttack = this.attacks.find(a => a.name === attack.name);
    if (existingAttack) {
      return false;
    }

    this.attacks.push(attack.clone());
    return true;
  }

  public heal(): void {
    this.lifePoint = this.maxLifePoint;
    this.attacks.forEach(attack => attack.resetUsage());
  }

  public attack(target: Pokemon): number {
    const availableAttacks = this.attacks.filter(attack => attack.canUse());
    
    if (availableAttacks.length === 0) {
      return 0;
    }

    const randomIndex = Math.floor(Math.random() * availableAttacks.length);
    const selectedAttack = availableAttacks[randomIndex];

    if (selectedAttack.use()) {
      const damage = selectedAttack.damage;
      target.takeDamage(damage);
      return damage;
    }

    return 0;
  }

  public takeDamage(damage: number): void {
    this.lifePoint = Math.max(0, this.lifePoint - damage);
  }

  public isKO(): boolean {
    return this.lifePoint <= 0;
  }

  public isAlive(): boolean {
    return this.lifePoint > 0;
  }

  public getAvailableAttacks(): Attack[] {
    return this.attacks.filter(attack => attack.canUse());
  }

  public static getPokemonWithMostHP(pokemons: Pokemon[]): Pokemon | null {
    if (pokemons.length === 0) return null;
    
    return pokemons.reduce((max, current) => 
      current.lifePoint > max.lifePoint ? current : max
    );
  }

  public displayInfo(): string {
    const attacksInfo = this.attacks.map(attack => attack.displayInfo()).join('\n  ');
    return `Pokémon: ${this.name}\nPV: ${this.lifePoint}/${this.maxLifePoint}\nAttaques:\n  ${attacksInfo}`;
  }

  public clone(): Pokemon {
    const clonedPokemon = new Pokemon(this.name, this.maxLifePoint, this.id);
    clonedPokemon.lifePoint = this.lifePoint;
    clonedPokemon.attacks = this.attacks.map(attack => attack.clone());
    return clonedPokemon;
  }
}