import { Router } from 'express';
import { LaundryUserController } from '../controllers/laundryUser.controller';

const router = Router();
const laundryUserController = new LaundryUserController();

router.get('/', laundryUserController.getAllUsers);
router.get('/:id', laundryUserController.getUserById);
router.post('/login', laundryUserController.getUserByUsername);
router.post('/', laundryUserController.createUser);
router.put('/:id', laundryUserController.updateUser);
router.delete('/:id', laundryUserController.deleteUser);

export default router;
