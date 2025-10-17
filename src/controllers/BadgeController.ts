import { Request, Response } from 'express';
import { badgeService } from '../services/BadgeService';

export class BadgeController {
  async getAllBadges(req: Request, res: Response): Promise<void> {
    try {
      const badges = await badgeService.getAllBadges();
      res.json({
        success: true,
        data: badges,
        count: badges.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async getBadgeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }

      const badge = await badgeService.getBadgeById(id);
      if (!badge) {
        res.status(404).json({
          success: false,
          message: 'Badge introuvable'
        });
        return;
      }

      res.json({
        success: true,
        data: badge
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du badge',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async createBadge(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, gymLeader, difficulty } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le nom du badge est requis'
        });
        return;
      }

      if (!description || typeof description !== 'string' || description.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'La description du badge est requise'
        });
        return;
      }

      if (!gymLeader || typeof gymLeader !== 'string' || gymLeader.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le nom du leader de gym est requis'
        });
        return;
      }

      if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 8) {
        res.status(400).json({
          success: false,
          message: 'La difficulté doit être un nombre entre 1 et 8'
        });
        return;
      }

      const badge = await badgeService.createBadge({
        name: name.trim(),
        description: description.trim(),
        gymLeader: gymLeader.trim(),
        difficulty
      });

      res.status(201).json({
        success: true,
        data: badge,
        message: 'Badge créé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du badge',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async awardBadgeToTrainer(req: Request, res: Response): Promise<void> {
    try {
      const badgeId = parseInt(req.params.badgeId);
      const trainerId = parseInt(req.params.trainerId);

      if (isNaN(badgeId) || isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'IDs invalides'
        });
        return;
      }

      await badgeService.awardBadgeToTrainer(badgeId, trainerId);

      res.json({
        success: true,
        message: 'Badge attribué avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'attribution du badge',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async getTrainerBadges(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.trainerId);
      if (isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'ID du dresseur invalide'
        });
        return;
      }

      const badges = await badgeService.getTrainerBadges(trainerId);
      res.json({
        success: true,
        data: badges,
        count: badges.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges du dresseur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async initializeDefaultBadges(req: Request, res: Response): Promise<void> {
    try {
      await badgeService.initializeDefaultBadges();
      res.json({
        success: true,
        message: 'Badges par défaut initialisés avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'initialisation des badges',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}

export const badgeController = new BadgeController();