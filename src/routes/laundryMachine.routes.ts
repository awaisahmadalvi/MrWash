import { Router } from 'express';
import { LaundryMachineController } from '../controllers/laundryMachine.controller';

const router = Router();
const laundryMachineController = new LaundryMachineController();

// Basic CRUD operations
router.get('/', laundryMachineController.getAllMachines);
router.get('/hall/:hallId', laundryMachineController.getMachinesByHall);
router.get('/:id', laundryMachineController.getMachineById);
router.post('/', laundryMachineController.createMachine);
router.put('/:id', laundryMachineController.updateMachine);
router.delete('/:id', laundryMachineController.deleteMachine);

// Special operations
router.patch('/:id/status', laundryMachineController.updateMachineStatus);
router.patch('/:id/power', laundryMachineController.toggleMachinePower);

export default router;
