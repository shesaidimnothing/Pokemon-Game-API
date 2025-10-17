export interface IAttack {
  id?: number;
  name: string;
  damage: number;
  usageLimit: number;
  currentUsage: number;
}

export interface IPokemon {
  id?: number;
  name: string;
  lifePoint: number;
  maxLifePoint: number;
  attacks: IAttack[];
}

export interface ITrainer {
  id?: number;
  name: string;
  level: number;
  experience: number;
  pokemons: IPokemon[];
}

export interface IBadge {
  id?: number;
  name: string;
  description: string;
  gymLeader: string;
  difficulty: number;
  isObtained: boolean;
  obtainedAt?: Date;
}

export interface ICombatResult {
  winner: ITrainer;
  loser: ITrainer;
  rounds: number;
  details: string[];
}

export interface IArenaResult {
  winner: ITrainer;
  totalBattles: number;
  results: ICombatResult[];
}

