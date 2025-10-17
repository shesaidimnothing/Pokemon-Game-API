import { IBadge } from '../types';

export class Badge implements IBadge {
  public id?: number;
  public name: string;
  public description: string;
  public gymLeader: string;
  public difficulty: number;
  public isObtained: boolean;
  public obtainedAt?: Date;

  constructor(name: string, description: string, gymLeader: string, difficulty: number, id?: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.gymLeader = gymLeader;
    this.difficulty = difficulty;
    this.isObtained = false;
  }

  public award(trainerName: string): void {
    this.isObtained = true;
    this.obtainedAt = new Date();
    console.log(`🏆 ${trainerName} earned the ${this.name} Badge!`);
  }

  public canBeObtained(trainerLevel: number): boolean {
    return trainerLevel >= this.difficulty;
  }

  public displayInfo(): string {
    const status = this.isObtained ? '✅ Obtained' : '❌ Not Obtained';
    const obtainedDate = this.obtainedAt ? ` (${this.obtainedAt.toLocaleDateString()})` : '';
    return `${this.name} - ${this.description} - Leader: ${this.gymLeader} - ${status}${obtainedDate}`;
  }

  public reset(): void {
    this.isObtained = false;
    this.obtainedAt = undefined;
  }

  public clone(): Badge {
    const clonedBadge = new Badge(this.name, this.description, this.gymLeader, this.difficulty, this.id);
    clonedBadge.isObtained = this.isObtained;
    clonedBadge.obtainedAt = this.obtainedAt;
    return clonedBadge;
  }
}