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

  public use(): boolean {
    if (this.currentUsage >= this.usageLimit) {
      return false;
    }
    this.currentUsage++;
    return true;
  }

  public canUse(): boolean {
    return this.currentUsage < this.usageLimit;
  }

  public resetUsage(): void {
    this.currentUsage = 0;
  }

  public displayInfo(): string {
    return `${this.name} - Dégâts: ${this.damage} - Usages: ${this.currentUsage}/${this.usageLimit}`;
  }

  public clone(): Attack {
    const clonedAttack = new Attack(this.name, this.damage, this.usageLimit, this.id);
    clonedAttack.currentUsage = this.currentUsage;
    return clonedAttack;
  }
}