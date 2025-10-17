import { databaseService } from './database';
import { Badge } from '../models/Badge';
import { IBadge } from '../types';

export class BadgeService {
  async getAllBadges(): Promise<Badge[]> {
    const query = 'SELECT * FROM badges ORDER BY difficulty';
    const result = await databaseService.query(query);
    return result.rows.map((row: any) => this.mapRowToBadge(row));
  }

  async getBadgeById(id: number): Promise<Badge | null> {
    const query = 'SELECT * FROM badges WHERE id = $1';
    const result = await databaseService.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToBadge(result.rows[0]);
  }

  async createBadge(badgeData: Omit<IBadge, 'id' | 'isObtained' | 'obtainedAt'>): Promise<Badge> {
    const query = `
      INSERT INTO badges (name, description, gym_leader, difficulty) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, description, gym_leader, difficulty
    `;
    
    const result = await databaseService.query(query, [
      badgeData.name,
      badgeData.description,
      badgeData.gymLeader,
      badgeData.difficulty
    ]);
    
    return this.mapRowToBadge(result.rows[0]);
  }

  async awardBadgeToTrainer(badgeId: number, trainerId: number): Promise<boolean> {
    const checkQuery = `
      SELECT COUNT(*) FROM trainer_badges 
      WHERE trainer_id = $1 AND badge_id = $2
    `;
    const checkResult = await databaseService.query(checkQuery, [trainerId, badgeId]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      throw new Error('Trainer already has this badge');
    }

    const insertQuery = `
      INSERT INTO trainer_badges (trainer_id, badge_id, obtained_at) 
      VALUES ($1, $2, NOW())
    `;
    
    await databaseService.query(insertQuery, [trainerId, badgeId]);
    return true;
  }

  async getTrainerBadges(trainerId: number): Promise<Badge[]> {
    const query = `
      SELECT b.*, tb.obtained_at
      FROM badges b
      JOIN trainer_badges tb ON b.id = tb.badge_id
      WHERE tb.trainer_id = $1
      ORDER BY b.difficulty
    `;
    
    const result = await databaseService.query(query, [trainerId]);
    return result.rows.map((row: any) => {
      const badge = this.mapRowToBadge(row);
      badge.isObtained = true;
      badge.obtainedAt = new Date(row.obtained_at);
      return badge;
    });
  }

  async initializeDefaultBadges(): Promise<void> {
    const defaultBadges = [
      { name: 'Boulder Badge', description: 'Awarded for defeating Brock', gymLeader: 'Brock', difficulty: 1 },
      { name: 'Cascade Badge', description: 'Awarded for defeating Misty', gymLeader: 'Misty', difficulty: 2 },
      { name: 'Thunder Badge', description: 'Awarded for defeating Lt. Surge', gymLeader: 'Lt. Surge', difficulty: 3 },
      { name: 'Rainbow Badge', description: 'Awarded for defeating Erika', gymLeader: 'Erika', difficulty: 4 },
      { name: 'Soul Badge', description: 'Awarded for defeating Koga', gymLeader: 'Koga', difficulty: 5 },
      { name: 'Marsh Badge', description: 'Awarded for defeating Sabrina', gymLeader: 'Sabrina', difficulty: 6 },
      { name: 'Volcano Badge', description: 'Awarded for defeating Blaine', gymLeader: 'Blaine', difficulty: 7 },
      { name: 'Earth Badge', description: 'Awarded for defeating Giovanni', gymLeader: 'Giovanni', difficulty: 8 }
    ];

    for (const badge of defaultBadges) {
      const existingQuery = 'SELECT COUNT(*) FROM badges WHERE name = $1';
      const existingResult = await databaseService.query(existingQuery, [badge.name]);
      
      if (parseInt(existingResult.rows[0].count) === 0) {
        await this.createBadge(badge);
      }
    }
  }

  private mapRowToBadge(row: any): Badge {
    const badge = new Badge(
      row.name,
      row.description,
      row.gym_leader,
      row.difficulty,
      row.id
    );
    
    if (row.obtained_at) {
      badge.isObtained = true;
      badge.obtainedAt = new Date(row.obtained_at);
    }
    
    return badge;
  }
}

export const badgeService = new BadgeService();