import { Request, Response } from 'express';
import { mockCombatService } from '../services/MockCombatService';

export class MockCombatController {
  /**
   * Défi aléatoire entre deux dresseurs
   */
  async randomChallenge(req: Request, res: Response): Promise<void> {
    try {
      const { trainer1Id, trainer2Id } = req.body;

      if (!trainer1Id || !trainer2Id) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des deux dresseurs sont requis'
        });
        return;
      }

      const trainer1IdNum = parseInt(trainer1Id);
      const trainer2IdNum = parseInt(trainer2Id);

      if (isNaN(trainer1IdNum) || isNaN(trainer2IdNum)) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des dresseurs doivent être des nombres valides'
        });
        return;
      }

      if (trainer1IdNum === trainer2IdNum) {
        res.status(400).json({
          success: false,
          message: 'Un dresseur ne peut pas se battre contre lui-même'
        });
        return;
      }

      const result = await mockCombatService.randomChallenge(trainer1IdNum, trainer2IdNum);

      res.json({
        success: true,
        data: result,
        message: 'Défi aléatoire terminé'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du défi aléatoire',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Défi déterministe entre deux dresseurs
   */
  async deterministicChallenge(req: Request, res: Response): Promise<void> {
    try {
      const { trainer1Id, trainer2Id } = req.body;

      if (!trainer1Id || !trainer2Id) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des deux dresseurs sont requis'
        });
        return;
      }

      const trainer1IdNum = parseInt(trainer1Id);
      const trainer2IdNum = parseInt(trainer2Id);

      if (isNaN(trainer1IdNum) || isNaN(trainer2IdNum)) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des dresseurs doivent être des nombres valides'
        });
        return;
      }

      if (trainer1IdNum === trainer2IdNum) {
        res.status(400).json({
          success: false,
          message: 'Un dresseur ne peut pas se battre contre lui-même'
        });
        return;
      }

      const result = await mockCombatService.deterministicChallenge(trainer1IdNum, trainer2IdNum);

      res.json({
        success: true,
        data: result,
        message: 'Défi déterministe terminé'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du défi déterministe',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Arène 1 : 100 combats aléatoires successifs
   */
  async arena1(req: Request, res: Response): Promise<void> {
    try {
      const { trainer1Id, trainer2Id } = req.body;

      if (!trainer1Id || !trainer2Id) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des deux dresseurs sont requis'
        });
        return;
      }

      const trainer1IdNum = parseInt(trainer1Id);
      const trainer2IdNum = parseInt(trainer2Id);

      if (isNaN(trainer1IdNum) || isNaN(trainer2IdNum)) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des dresseurs doivent être des nombres valides'
        });
        return;
      }

      if (trainer1IdNum === trainer2IdNum) {
        res.status(400).json({
          success: false,
          message: 'Un dresseur ne peut pas se battre contre lui-même'
        });
        return;
      }

      const result = await mockCombatService.arena1(trainer1IdNum, trainer2IdNum);

      res.json({
        success: true,
        data: result,
        message: 'Arène 1 terminée'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'arène 1',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Arène 2 : 100 combats déterministes consécutifs
   */
  async arena2(req: Request, res: Response): Promise<void> {
    try {
      const { trainer1Id, trainer2Id } = req.body;

      if (!trainer1Id || !trainer2Id) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des deux dresseurs sont requis'
        });
        return;
      }

      const trainer1IdNum = parseInt(trainer1Id);
      const trainer2IdNum = parseInt(trainer2Id);

      if (isNaN(trainer1IdNum) || isNaN(trainer2IdNum)) {
        res.status(400).json({
          success: false,
          message: 'Les IDs des dresseurs doivent être des nombres valides'
        });
        return;
      }

      if (trainer1IdNum === trainer2IdNum) {
        res.status(400).json({
          success: false,
          message: 'Un dresseur ne peut pas se battre contre lui-même'
        });
        return;
      }

      const result = await mockCombatService.arena2(trainer1IdNum, trainer2IdNum);

      res.json({
        success: true,
        data: result,
        message: 'Arène 2 terminée'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'arène 2',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healTrainerPokemons(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.id);
      if (isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'ID du dresseur invalide'
        });
        return;
      }

      await mockCombatService.healTrainerPokemons(trainerId);

      res.json({
        success: true,
        message: 'Tous les Pokémon du dresseur ont été soignés'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du soin des Pokémon',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Obtient les statistiques de combat d'un dresseur
   */
  async getTrainerCombatStats(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.id);
      if (isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'ID du dresseur invalide'
        });
        return;
      }

      const stats = await mockCombatService.getTrainerCombatStats(trainerId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}

export const mockCombatController = new MockCombatController();
