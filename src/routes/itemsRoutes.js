import { Router } from 'express';
import {
  addItem,
  findItem,
  listItems,
  removeItem,
  replaceItem,
} from '../controllers/itemsController.js';

const router = Router();

router.get('/', listItems);
router.get('/:id', findItem);
router.post('/', addItem);
router.put('/:id', replaceItem);
router.delete('/:id', removeItem);

export default router;
