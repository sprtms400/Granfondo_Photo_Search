import * as e from 'express';
import * as oUserCtrl from '../controllers/UserCtrl';
const router = e.Router();

router.post('/register', oUserCtrl.create);
router.post('/login', oUserCtrl.login);
router.get('/user/:userDocId/verification', oUserCtrl.emailAuthentcationCallback);