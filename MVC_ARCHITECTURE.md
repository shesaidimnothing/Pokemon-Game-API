# 🏗️ MVC Architecture - Pokemon Game API

## Overview
This Pokemon Game API follows the **Model-View-Controller (MVC)** architectural pattern, which separates concerns into three distinct layers:

## 📊 MVC Pattern Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   HTML Views    │  │   CSS Styles    │  │  JavaScript     │ │
│  │  (index.html)   │  │  (style.css)    │  │  (script.js)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP Requests/Responses
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ROUTES LAYER                            │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │ │
│  │  │ trainerRoutes   │  │  combatRoutes   │  │  static      │ │ │
│  │  │                 │  │                 │  │  middleware  │ │ │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 CONTROLLERS LAYER                          │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │ │
│  │  │TrainerController│  │CombatController │  │ErrorHandler  │ │ │
│  │  │                 │  │                 │  │              │ │ │
│  │  │• getAllTrainers │  │• randomChallenge│  │• handleError │ │ │
│  │  │• createTrainer  │  │• arena1         │  │• validate    │ │ │
│  │  │• updateTrainer  │  │• arena2         │  │              │ │ │
│  │  │• deleteTrainer  │  │• getStats       │  │              │ │ │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   SERVICES LAYER                           │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │ │
│  │  │ TrainerService  │  │ CombatService   │  │DatabaseService│ │ │
│  │  │                 │  │                 │  │              │ │ │
│  │  │• CRUD operations│  │• Battle logic   │  │• DB queries  │ │ │
│  │  │• Data validation│  │• Arena logic    │  │• Connections │ │ │
│  │  │• Business rules │  │• Statistics     │  │• Transactions│ │ │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODELS LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │     Trainer     │  │     Pokemon     │  │     Attack      │ │
│  │                 │  │                 │  │                 │ │
│  │• name           │  │• name           │  │• name           │ │
│  │• level          │  │• lifePoint      │  │• damage         │ │
│  │• experience     │  │• maxLifePoint   │  │• usageLimit     │ │
│  │• pokemons[]     │  │• attacks[]      │  │• currentUsage   │ │
│  │                 │  │                 │  │                 │ │
│  │• addPokemon()   │  │• learnAttack()  │  │• use()          │ │
│  │• healAll()      │  │• attack()       │  │• canUse()       │ │
│  │• gainExp()      │  │• takeDamage()   │  │• resetUsage()   │ │
│  │• randomChallenge│  │• heal()         │  │• displayInfo()  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    trainers     │  │    pokemons     │  │    attacks      │ │
│  │                 │  │                 │  │                 │ │
│  │• id (PK)        │  │• id (PK)        │  │• id (PK)        │ │
│  │• name           │  │• name           │  │• name           │ │
│  │• level          │  │• max_life_point │  │• damage         │ │
│  │• experience     │  │• life_point     │  │• usage_limit    │ │
│  │• created_at     │  │• trainer_id (FK)│  │• created_at     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                │                                │
│  ┌─────────────────────────────┴─────────────────────────────┐ │
│  │              pokemon_attacks (Junction Table)            │ │
│  │• pokemon_id (FK)                                         │ │
│  │• attack_id (FK)                                          │ │
│  │• current_usage                                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Detailed MVC Components

### 1. **MODELS** (`/src/models/`)
**Purpose**: Contains business logic and data structures

#### `Trainer.ts` - Trainer Model
```typescript
class Trainer {
  // Properties (Data)
  public id?: number;
  public name: string;
  public level: number;
  public experience: number;
  public pokemons: Pokemon[];

  // Methods (Business Logic)
  public addPokemon(pokemon: Pokemon): boolean
  public healAllPokemons(): void
  public gainExperience(amount: number): void
  public randomChallenge(opponent: Trainer): BattleResult
  public deterministicChallenge(opponent: Trainer): BattleResult
}
```

#### `Pokemon.ts` - Pokemon Model
```typescript
class Pokemon {
  // Properties (Data)
  public id?: number;
  public name: string;
  public lifePoint: number;
  public maxLifePoint: number;
  public attacks: Attack[];

  // Methods (Business Logic)
  public learnAttack(attack: Attack): boolean
  public attack(target: Pokemon): number
  public takeDamage(damage: number): void
  public heal(): void
  public isKO(): boolean
}
```

#### `Attack.ts` - Attack Model
```typescript
class Attack {
  // Properties (Data)
  public id?: number;
  public name: string;
  public damage: number;
  public usageLimit: number;
  public currentUsage: number;

  // Methods (Business Logic)
  public use(): boolean
  public canUse(): boolean
  public resetUsage(): void
  public displayInfo(): string
}
```

### 2. **VIEWS** (`/public/` + JSON responses)
**Purpose**: Handles presentation and user interface

#### Frontend Views
- **`index.html`** - Main HTML structure
- **`style.css`** - CSS styling and layout
- **`script.js`** - JavaScript for user interactions

#### API Views (JSON responses)
```typescript
// Example API response format
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ash",
    "level": 5,
    "experience": 10,
    "pokemons": [...]
  },
  "message": "Trainer retrieved successfully"
}
```

### 3. **CONTROLLERS** (`/src/controllers/`)
**Purpose**: Handles HTTP requests and coordinates between Models and Views

#### `TrainerController.ts` - Trainer Controller
```typescript
class TrainerController {
  // HTTP Request Handlers
  async getAllTrainers(req: Request, res: Response): Promise<void>
  async getTrainerById(req: Request, res: Response): Promise<void>
  async createTrainer(req: Request, res: Response): Promise<void>
  async updateTrainer(req: Request, res: Response): Promise<void>
  async deleteTrainer(req: Request, res: Response): Promise<void>
  async addPokemonToTrainer(req: Request, res: Response): Promise<void>
  async healAllPokemons(req: Request, res: Response): Promise<void>
  async getAllAttacks(req: Request, res: Response): Promise<void>
  async addAttackToPokemon(req: Request, res: Response): Promise<void>
  async removeAttackFromPokemon(req: Request, res: Response): Promise<void>
}
```

#### `CombatController.ts` - Combat Controller
```typescript
class CombatController {
  // HTTP Request Handlers
  async randomChallenge(req: Request, res: Response): Promise<void>
  async deterministicChallenge(req: Request, res: Response): Promise<void>
  async arena1(req: Request, res: Response): Promise<void>
  async arena2(req: Request, res: Response): Promise<void>
  async getStats(req: Request, res: Response): Promise<void>
}
```

### 4. **SERVICES** (`/src/services/`)
**Purpose**: Contains business logic and data access

#### `TrainerService.ts` - Trainer Service
```typescript
class TrainerService {
  // Data Access Methods
  async getAllTrainers(): Promise<Trainer[]>
  async getTrainerById(id: number): Promise<Trainer | null>
  async createTrainer(trainerData: { name: string }): Promise<Trainer>
  async updateTrainer(id: number, data: Partial<ITrainer>): Promise<Trainer | null>
  async deleteTrainer(id: number): Promise<boolean>
  async addPokemonToTrainer(trainerId: number, pokemonData: any): Promise<Pokemon | null>
  async healAllPokemons(trainerId: number): Promise<boolean>
  async getAllAttacks(): Promise<Attack[]>
  async addAttackToPokemon(trainerId: number, pokemonId: number, attackId: number): Promise<Trainer | null>
  async removeAttackFromPokemon(trainerId: number, pokemonId: number, attackId: number): Promise<boolean>
}
```

#### `CombatService.ts` - Combat Service
```typescript
class CombatService {
  // Business Logic Methods
  async randomChallenge(trainer1Id: number, trainer2Id: number): Promise<BattleResult>
  async deterministicChallenge(trainer1Id: number, trainer2Id: number): Promise<BattleResult>
  async arena1(trainer1Id: number, trainer2Id: number): Promise<ArenaResult>
  async arena2(trainer1Id: number, trainer2Id: number): Promise<ArenaResult>
  async getStats(trainerId: number): Promise<TrainerStats>
}
```

#### `DatabaseService.ts` - Database Service
```typescript
class DatabaseService {
  // Database Access Methods
  async query(text: string, params?: any[]): Promise<any>
  async getConnection(): Promise<PoolClient>
  async initializeTables(): Promise<void>
  async seedTestData(): Promise<void>
  async close(): Promise<void>
}
```

### 5. **ROUTES** (`/src/routes/`)
**Purpose**: Defines API endpoints and maps them to controllers

#### `trainerRoutes.ts` - Trainer Routes
```typescript
// Routes mapping
router.get('/', trainerController.getAllTrainers.bind(trainerController));
router.get('/:id', trainerController.getTrainerById.bind(trainerController));
router.post('/', trainerController.createTrainer.bind(trainerController));
router.put('/:id', trainerController.updateTrainer.bind(trainerController));
router.delete('/:id', trainerController.deleteTrainer.bind(trainerController));
router.post('/:id/pokemons', trainerController.addPokemonToTrainer.bind(trainerController));
router.post('/:id/heal', trainerController.healAllPokemons.bind(trainerController));
router.get('/attacks', trainerController.getAllAttacks.bind(trainerController));
router.post('/:trainerId/pokemons/:pokemonId/attacks', trainerController.addAttackToPokemon.bind(trainerController));
router.delete('/:trainerId/pokemons/:pokemonId/attacks/:attackId', trainerController.removeAttackFromPokemon.bind(trainerController));
```

## 🔄 MVC Flow Example

### Example: Adding a Pokemon to a Trainer

1. **CLIENT** → Sends HTTP POST request to `/api/trainers/1/pokemons`
2. **ROUTES** → `trainerRoutes.ts` receives request and routes to `TrainerController.addPokemonToTrainer()`
3. **CONTROLLER** → `TrainerController.addPokemonToTrainer()`:
   - Validates request data
   - Calls `TrainerService.addPokemonToTrainer()`
   - Handles response formatting
4. **SERVICE** → `TrainerService.addPokemonToTrainer()`:
   - Validates business rules (6 Pokemon limit)
   - Calls `DatabaseService.query()` to insert data
   - Returns updated Trainer object
5. **DATABASE** → PostgreSQL stores the new Pokemon
6. **MODEL** → `Pokemon` class handles business logic
7. **CONTROLLER** → Formats response as JSON
8. **CLIENT** → Receives JSON response with updated trainer data

## 🎯 MVC Benefits in This Project

### 1. **Separation of Concerns**
- **Models**: Focus on business logic and data validation
- **Views**: Focus on presentation (HTML/CSS/JSON)
- **Controllers**: Focus on HTTP request handling

### 2. **Maintainability**
- Easy to modify business logic without touching UI
- Easy to change database without affecting business logic
- Easy to add new features following the same pattern

### 3. **Testability**
- Each layer can be tested independently
- Models can be unit tested
- Controllers can be integration tested
- Services can be mocked for testing

### 4. **Scalability**
- Easy to add new controllers for new features
- Easy to add new models for new entities
- Easy to add new views for different clients (mobile, web, etc.)

## 🚀 How to Extend the MVC Pattern

### Adding a New Feature (e.g., Items System)

1. **Create Model**: `src/models/Item.ts`
2. **Create Service**: `src/services/ItemService.ts`
3. **Create Controller**: `src/controllers/ItemController.ts`
4. **Create Routes**: `src/routes/itemRoutes.ts`
5. **Update Database**: Add items table
6. **Update Frontend**: Add item management UI

This follows the exact same pattern as the existing Pokemon and Trainer systems!
