import { Router } from 'express';
import { WashesHistoryController } from '../controllers/washesHistory.controller';

const router = Router();
const washesHistoryController = new WashesHistoryController();

// Basic CRUD operations
router.get('/', washesHistoryController.getAllWashes);
router.get('/user/:userId', washesHistoryController.getWashesByUser);
router.get('/machine/:machineId', washesHistoryController.getWashesByMachine);
router.get('/:id', washesHistoryController.getWashById);
router.post('/', washesHistoryController.createWash);
router.put('/:id', washesHistoryController.updateWash);
router.delete('/:id', washesHistoryController.deleteWash);

// Special operations
router.patch('/:id/status', washesHistoryController.updateWashStatus);

export default router;
