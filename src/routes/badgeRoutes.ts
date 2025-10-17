import { Router } from 'express';
import { badgeController } from '../controllers/BadgeController';

const router = Router();

router.get('/', badgeController.getAllBadges.bind(badgeController));
router.get('/:id', badgeController.getBadgeById.bind(badgeController));
router.post('/', badgeController.createBadge.bind(badgeController));
router.post('/initialize', badgeController.initializeDefaultBadges.bind(badgeController));

router.post('/:badgeId/trainers/:trainerId', badgeController.awardBadgeToTrainer.bind(badgeController));
router.get('/trainers/:trainerId', badgeController.getTrainerBadges.bind(badgeController));

export default router;