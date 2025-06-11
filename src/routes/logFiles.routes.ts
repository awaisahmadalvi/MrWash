import { Router } from 'express';
import { LogFilesController } from '../controllers/logFiles.controller';

const router = Router();
const logFilesController = new LogFilesController();

// Basic CRUD operations
router.get('/', logFilesController.getAllLogFiles);
router.get('/:id', logFilesController.getLogFileById);
router.get('/machine/:machineId', logFilesController.getLogFilesByMachine);
router.get(
  '/transaction/:transactionId',
  logFilesController.getLogFilesByTransaction
);
router.post('/', logFilesController.createLogFile);
router.put('/:id', logFilesController.updateLogFile);
router.delete('/:id', logFilesController.deleteLogFile);

export default router;
