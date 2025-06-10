import { Router } from 'express';
import { LaundryHallController } from '../controllers/laundryHall.controller';

const router = Router();
const laundryHallController = new LaundryHallController();

// Basic CRUD operations
router.get('/', laundryHallController.getAllHalls);
router.get('/university/:uid', laundryHallController.getHallsByUniversity);
router.get('/:id', laundryHallController.getHallById);
router.post('/', laundryHallController.createHall);
router.put('/:id', laundryHallController.updateHall);
router.delete('/:id', laundryHallController.deleteHall);

export default router;
