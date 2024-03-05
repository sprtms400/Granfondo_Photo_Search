import * as e from 'express';
import * as oUserCtrl from '../controllers/UserCtrl';
const router = e.Router();

router.post('/user/register', oUserCtrl.create);
router.post('/user/login', oUserCtrl.login);
router.get('/user/:userDocId/verification', oUserCtrl.emailAuthentcationCallback);

export default router;