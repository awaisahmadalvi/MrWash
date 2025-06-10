import { Router } from 'express';
import { UniversityController } from '../controllers/university.controller';

const router = Router();
const universityController = new UniversityController();

router.get('/', universityController.getAllUniversities);
router.get('/:id', universityController.getUniversityById);
router.post('/', universityController.createUniversity);
router.put('/:id', universityController.updateUniversity);
router.delete('/:id', universityController.deleteUniversity);

export default router;
