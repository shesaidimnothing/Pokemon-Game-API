import { Request, Response } from 'express';
import { trainerService } from '../services/TrainerService';

export class TrainerController {
  async getAllTrainers(req: Request, res: Response): Promise<void> {
    try {
      const trainers = await trainerService.getAllTrainers();
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

      const trainer = await trainerService.getTrainerById(id);
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

      const trainer = await trainerService.createTrainer({ name: name.trim() });
      
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

      const trainer = await trainerService.updateTrainer(id, updateData);
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

      const deleted = await trainerService.deleteTrainer(id);
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

      const pokemon = await trainerService.addPokemonToTrainer(trainerId, {
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

      await trainerService.healAllPokemons(trainerId);

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

  async getAllAttacks(req: Request, res: Response): Promise<void> {
    try {
      const attacks = await trainerService.getAllAttacks();
      res.json({
        success: true,
        data: attacks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des attaques',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async addAttackToPokemon(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.trainerId);
      const pokemonId = parseInt(req.params.pokemonId);
      const attackId = parseInt(req.body.attackId);

      if (isNaN(trainerId) || isNaN(pokemonId) || isNaN(attackId)) {
        res.status(400).json({
          success: false,
          message: 'IDs invalides'
        });
        return;
      }

      const result = await trainerService.addAttackToPokemon(trainerId, pokemonId, attackId);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Dresseur, Pokémon ou attaque introuvable'
        });
        return;
      }

      res.json({
        success: true,
        data: result,
        message: 'Attaque ajoutée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'attaque',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async removeAttackFromPokemon(req: Request, res: Response): Promise<void> {
    try {
      const trainerId = parseInt(req.params.trainerId);
      const pokemonId = parseInt(req.params.pokemonId);
      const attackId = parseInt(req.params.attackId);

      if (isNaN(trainerId) || isNaN(pokemonId) || isNaN(attackId)) {
        res.status(400).json({
          success: false,
          message: 'IDs invalides'
        });
        return;
      }

      const result = await trainerService.removeAttackFromPokemon(trainerId, pokemonId, attackId);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Dresseur, Pokémon ou attaque introuvable'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Attaque supprimée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'attaque',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}

export const trainerController = new TrainerController();