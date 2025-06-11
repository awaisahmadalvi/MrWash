import { Router } from 'express';
import { DiscountPolicyController } from '../controllers/discountPolicy.controller';

const router = Router();
const discountPolicyController = new DiscountPolicyController();

// Basic CRUD operations
router.get('/', discountPolicyController.getAllPolicies);
router.get('/active', discountPolicyController.getActivePolicies);
router.get('/machine/:machineId', discountPolicyController.getPolicyByMachine);
router.post('/', discountPolicyController.createPolicy);
router.put('/:machineId', discountPolicyController.updatePolicy);
router.delete('/:machineId', discountPolicyController.deletePolicy);

export default router;
