import * as e from 'express';
import * as oPColorCtrl from '../controllers/ColorCtrl';
import * as oMiddlewares from '../middlewares';

const router = e.Router();

router.post('/color/create', oPColorCtrl.create);
router.get('/colors', oPColorCtrl.getColors);

export default router;