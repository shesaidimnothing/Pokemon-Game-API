# 🎯 MVC Pattern Examples - Pokemon Game API

## 📋 Quick Reference: MVC Components

| Component | Location | Purpose | Example |
|-----------|----------|---------|---------|
| **Models** | `/src/models/` | Business logic & data | `Trainer`, `Pokemon`, `Attack` |
| **Views** | `/public/` + JSON | Presentation layer | `index.html`, JSON responses |
| **Controllers** | `/src/controllers/` | HTTP request handling | `TrainerController`, `CombatController` |
| **Services** | `/src/services/` | Business logic & data access | `TrainerService`, `CombatService` |
| **Routes** | `/src/routes/` | API endpoint mapping | `trainerRoutes`, `combatRoutes` |

## 🔄 Real-World MVC Flow Examples

### Example 1: Creating a New Trainer

```
1. CLIENT (Browser)
   ┌─────────────────────────────────────┐
   │ User fills form: name="Ash"         │
   │ Clicks "Create Trainer" button      │
   │ JavaScript sends POST request       │
   └─────────────────────────────────────┘
                    │
                    │ HTTP POST /api/trainers
                    │ Body: {"name": "Ash"}
                    ▼
2. ROUTES (trainerRoutes.ts)
   ┌─────────────────────────────────────┐
   │ router.post('/', createTrainer)     │
   │ Routes to TrainerController         │
   └─────────────────────────────────────┘
                    │
                    ▼
3. CONTROLLER (TrainerController.ts)
   ┌─────────────────────────────────────┐
   │ async createTrainer(req, res) {     │
   │   const { name } = req.body;        │
   │   // Validate input                 │
   │   const trainer = await             │
   │     trainerService.createTrainer(   │
   │       { name: name.trim() }         │
   │     );                              │
   │   res.json({ success: true,         │
   │              data: trainer });      │
   │ }                                   │
   └─────────────────────────────────────┘
                    │
                    ▼
4. SERVICE (TrainerService.ts)
   ┌─────────────────────────────────────┐
   │ async createTrainer(data) {         │
   │   const query = `INSERT INTO        │
   │     trainers (name, level, exp)     │
   │     VALUES ($1, 1, 0)              │
   │     RETURNING id, name, level, exp`;│
   │   const result = await              │
   │     databaseService.query(query,    │
   │       [data.name]);                 │
   │   return new Trainer(result.rows[0]);│
   │ }                                   │
   └─────────────────────────────────────┘
                    │
                    ▼
5. DATABASE (PostgreSQL)
   ┌─────────────────────────────────────┐
   │ INSERT INTO trainers                │
   │ (name, level, experience)           │
   │ VALUES ('Ash', 1, 0)               │
   │ RETURNING id, name, level, exp;     │
   └─────────────────────────────────────┘
                    │
                    │ Returns: {id: 1, name: 'Ash', level: 1, exp: 0}
                    ▼
6. MODEL (Trainer.ts)
   ┌─────────────────────────────────────┐
   │ class Trainer {                     │
   │   constructor(name, id) {           │
   │     this.name = name;               │
   │     this.id = id;                   │
   │     this.level = 1;                 │
   │     this.experience = 0;            │
   │     this.pokemons = [];             │
   │   }                                 │
   │ }                                   │
   └─────────────────────────────────────┘
                    │
                    │ Returns Trainer object
                    ▼
7. VIEW (JSON Response)
   ┌─────────────────────────────────────┐
   │ {                                   │
   │   "success": true,                  │
   │   "data": {                         │
   │     "id": 1,                        │
   │     "name": "Ash",                  │
   │     "level": 1,                     │
   │     "experience": 0,                │
   │     "pokemons": []                  │
   │   },                                │
   │   "message": "Dresseur créé avec    │
   │              succès"                │
   │ }                                   │
   └─────────────────────────────────────┘
                    │
                    │ HTTP 201 Created
                    ▼
8. CLIENT (Browser)
   ┌─────────────────────────────────────┐
   │ JavaScript receives response        │
   │ Updates UI with new trainer         │
   │ Shows success message               │
   └─────────────────────────────────────┘
```

### Example 2: Pokemon Battle (Complex MVC Flow)

```
1. CLIENT → POST /api/combat/random-challenge
   Body: {"trainer1Id": 1, "trainer2Id": 2}

2. ROUTES → combatRoutes.ts
   router.post('/random-challenge', randomChallenge)

3. CONTROLLER → CombatController.randomChallenge()
   - Validates trainer IDs
   - Calls CombatService.randomChallenge()

4. SERVICE → CombatService.randomChallenge()
   - Gets both trainers from database
   - Calls Trainer.randomChallenge() method
   - Returns battle result

5. MODEL → Trainer.randomChallenge()
   - Heals all Pokemon
   - Selects random Pokemon
   - Executes battle logic
   - Updates experience/levels

6. DATABASE → Updates trainer stats

7. CONTROLLER → Formats battle result as JSON

8. CLIENT → Displays battle animation and results
```

## 🏗️ MVC Layer Responsibilities

### Models Layer (`/src/models/`)
**What they do:**
- Define data structure and business rules
- Contain methods for business logic
- Validate data integrity
- Handle relationships between entities

**Examples:**
```typescript
// Pokemon model handles attack logic
class Pokemon {
  public attack(target: Pokemon): number {
    const availableAttacks = this.attacks.filter(attack => attack.canUse());
    if (availableAttacks.length === 0) return 0;
    
    const randomAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
    if (randomAttack.use()) {
      const damage = randomAttack.damage;
      target.takeDamage(damage);
      return damage;
    }
    return 0;
  }
}
```

### Views Layer (`/public/` + JSON)
**What they do:**
- Present data to users
- Handle user interactions
- Format data for display
- Provide user interface

**Examples:**
```html
<!-- Frontend view for trainer display -->
<div class="trainer-card">
  <div class="trainer-name">${trainer.name}</div>
  <div class="trainer-info">
    Level: ${trainer.level} | Experience: ${trainer.experience}
  </div>
  <div class="pokemon-list">
    ${pokemonList}
  </div>
</div>
```

```typescript
// API view (JSON response)
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ash",
    "level": 5,
    "experience": 10,
    "pokemons": [...]
  }
}
```

### Controllers Layer (`/src/controllers/`)
**What they do:**
- Handle HTTP requests and responses
- Validate input data
- Coordinate between models and services
- Format responses
- Handle errors

**Examples:**
```typescript
// Controller handles HTTP request
async createTrainer(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;
    
    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Le nom du dresseur est requis'
      });
      return;
    }
    
    // Call service layer
    const trainer = await trainerService.createTrainer({ name: name.trim() });
    
    // Format response
    res.status(201).json({
      success: true,
      data: trainer,
      message: 'Dresseur créé avec succès'
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du dresseur',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
```

## 🔧 How to Add New Features Following MVC

### Adding a "Gym System" Feature

1. **Create Model** (`src/models/Gym.ts`):
```typescript
export class Gym {
  public id?: number;
  public name: string;
  public leader: Trainer;
  public badge: string;
  public pokemon: Pokemon[];

  public challenge(trainer: Trainer): BattleResult {
    // Gym battle logic
  }
}
```

2. **Create Service** (`src/services/GymService.ts`):
```typescript
export class GymService {
  async getAllGyms(): Promise<Gym[]> { /* ... */ }
  async getGymById(id: number): Promise<Gym | null> { /* ... */ }
  async challengeGym(gymId: number, trainerId: number): Promise<BattleResult> { /* ... */ }
}
```

3. **Create Controller** (`src/controllers/GymController.ts`):
```typescript
export class GymController {
  async getAllGyms(req: Request, res: Response): Promise<void> { /* ... */ }
  async challengeGym(req: Request, res: Response): Promise<void> { /* ... */ }
}
```

4. **Create Routes** (`src/routes/gymRoutes.ts`):
```typescript
router.get('/', gymController.getAllGyms.bind(gymController));
router.post('/:id/challenge', gymController.challengeGym.bind(gymController));
```

5. **Update Database** (add gyms table):
```sql
CREATE TABLE gyms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  leader_id INTEGER REFERENCES trainers(id),
  badge VARCHAR(50) NOT NULL
);
```

6. **Update Frontend** (add gym UI):
```html
<div class="gym-card" onclick="challengeGym(${gym.id})">
  <h3>${gym.name} Gym</h3>
  <p>Leader: ${gym.leader.name}</p>
  <p>Badge: ${gym.badge}</p>
</div>
```

## 🎯 MVC Best Practices in This Project

### 1. **Single Responsibility Principle**
- Each class has one clear purpose
- Models handle business logic
- Controllers handle HTTP
- Services handle data access

### 2. **Dependency Injection**
- Controllers depend on Services
- Services depend on Database
- Models are independent

### 3. **Error Handling**
- Controllers handle HTTP errors
- Services handle business logic errors
- Models validate data integrity

### 4. **Data Flow**
- Request → Route → Controller → Service → Model → Database
- Response ← Route ← Controller ← Service ← Model ← Database

### 5. **Separation of Concerns**
- UI logic in Views
- Business logic in Models
- HTTP logic in Controllers
- Data logic in Services

This MVC architecture makes the Pokemon Game API maintainable, testable, and scalable! 🚀
