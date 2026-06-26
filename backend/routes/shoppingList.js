import express from 'express';
import * as shoppingListController from '../controllers/shoppingListController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', shoppingListController.getShoppingList);
router.post('/generate', shoppingListController.generateFromMealPlan);

router.post('/', shoppingListController.addItem);
router.put('/:id', shoppingListController.updateItem);
router.patch('/:id/toggle', shoppingListController.toggleChecked);
router.delete('/:id', shoppingListController.deleteItem);

router.delete('/checked', shoppingListController.clearChecked);
router.delete('/all', shoppingListController.clearAll);

router.post('/add-to-pantry', shoppingListController.addCheckedToPantry);

export default router;
