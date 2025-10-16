import { Request, Response } from 'express';
import { mockTrainerService } from '../services/MockTrainerService';

export class MockTrainerController {
  /**
   * Récupère tous les dresseurs
   */
  async getAllTrainers(req: Request, res: Response): Promise<void> {
    try {
      const trainers = await mockTrainerService.getAllTrainers();
      res.json({
        success: true,
        data: trainers,
        count: trainers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des dresseurs',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Récupère un dresseur par ID
   */
  async getTrainerById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }

      const trainer = await mockTrainerService.getTrainerById(id);
      if (!trainer) {
        res.status(404).json({
          success: false,
          message: 'Dresseur introuvable'
        });
        return;
      }

      res.json({
        success: true,
        data: trainer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du dresseur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Crée un nouveau dresseur
   */
  async createTrainer(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le nom du dresseur est requis'
        });
        return;
      }

      const trainer = await mockTrainerService.createTrainer({ name: name.trim() });
      
      res.status(201).json({
        success: true,
        data: trainer,
        message: 'Dresseur créé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du dresseur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Met à jour un dresseur
   */
  async updateTrainer(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }

      const { name, level, experience } = req.body;
      const updateData: any = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          res.status(400).json({
            success: false,
            message: 'Le nom du dresseur doit être une chaîne non vide'
          });
          return;
        }
        updateData.name = name.trim();
      }

      if (level !== undefined) {
        if (typeof level !== 'number' || level < 1) {
          res.status(400).json({
            success: false,
            message: 'Le niveau doit être un nombre positif'
          });
          return;
        }
        updateData.level = level;
      }

      if (experience !== undefined) {
        if (typeof experience !== 'number' || experience < 0) {
          res.status(400).json({
            success: false,
            message: 'L\'expérience doit être un nombre positif ou zéro'
          });
          return;
        }
        updateData.experience = experience;
      }

      const trainer = await mockTrainerService.updateTrainer(id, updateData);
      if (!trainer) {
        res.status(404).json({
          success: false,
          message: 'Dresseur introuvable'
        });
        return;
      }

      res.json({
        success: true,
        data: trainer,
        message: 'Dresseur mis à jour avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du dresseur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Supprime un dresseur
   */
  async deleteTrainer(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }

      const deleted = await mockTrainerService.deleteTrainer(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Dresseur introuvable'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Dresseur supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du dresseur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Ajoute un Pokémon à un dresseur
   */
  async addPokemonToTrainer(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.id);
      if (isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'ID du dresseur invalide'
        });
        return;
      }

      const { name, maxLifePoint } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le nom du Pokémon est requis'
        });
        return;
      }

      if (typeof maxLifePoint !== 'number' || maxLifePoint <= 0) {
        res.status(400).json({
          success: false,
          message: 'Les points de vie maximum doivent être un nombre positif'
        });
        return;
      }

      const pokemon = await mockTrainerService.addPokemonToTrainer(trainerId, {
        name: name.trim(),
        maxLifePoint
      });

      if (!pokemon) {
        res.status(404).json({
          success: false,
          message: 'Dresseur introuvable'
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: pokemon,
        message: 'Pokémon ajouté avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'ajout du Pokémon',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Soigne tous les Pokémon d'un dresseur
   */
  async healAllPokemons(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.id);
      if (isNaN(trainerId)) {
        res.status(400).json({
          success: false,
          message: 'ID du dresseur invalide'
        });
        return;
      }

      await mockTrainerService.healAllPokemons(trainerId);

      res.json({
        success: true,
        message: 'Tous les Pokémon ont été soignés'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du soin des Pokémon',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}

export const mockTrainerController = new MockTrainerController();
