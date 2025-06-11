import { Router } from 'express';
import { StudentLedgerController } from '../controllers/studentLedger.controller';

const router = Router();
const studentLedgerController = new StudentLedgerController();

// Basic CRUD operations
router.get('/', studentLedgerController.getAllTransactions);
router.get('/user/:userId', studentLedgerController.getTransactionsByUser);
router.get('/user/:userId/balance', studentLedgerController.getStudentBalance);
router.get('/:id', studentLedgerController.getTransactionById);
router.post('/', studentLedgerController.createTransaction);
router.put('/:id', studentLedgerController.updateTransaction);
router.delete('/:id', studentLedgerController.deleteTransaction);

export default router;
