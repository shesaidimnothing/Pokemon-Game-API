import { IAttack } from '../types';

export class Attack implements IAttack {
  public id?: number;
  public name: string;
  public damage: number;
  public usageLimit: number;
  public currentUsage: number;

  constructor(name: string, damage: number, usageLimit: number, id?: number) {
    this.id = id;
    this.name = name;
    this.damage = damage;
    this.usageLimit = usageLimit;
    this.currentUsage = 0;
  }

  /**
   * Utilise l'attaque et incrémente le compteur d'usage
   * @returns true si l'attaque peut être utilisée, false sinon
   */
  public use(): boolean {
    if (this.currentUsage >= this.usageLimit) {
      return false;
    }
    this.currentUsage++;
    return true;
  }

  /**
   * Vérifie si l'attaque peut encore être utilisée
   */
  public canUse(): boolean {
    return this.currentUsage < this.usageLimit;
  }

  /**
   * Réinitialise le compteur d'usage
   */
  public resetUsage(): void {
    this.currentUsage = 0;
  }

  /**
   * Affiche les informations de l'attaque sous forme lisible
   */
  public displayInfo(): string {
    return `${this.name} - Dégâts: ${this.damage} - Usages: ${this.currentUsage}/${this.usageLimit}`;
  }

  /**
   * Crée une copie de l'attaque
   */
  public clone(): Attack {
    const clonedAttack = new Attack(this.name, this.damage, this.usageLimit, this.id);
    clonedAttack.currentUsage = this.currentUsage;
    return clonedAttack;
  }
}

