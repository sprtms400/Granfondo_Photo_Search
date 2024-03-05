import * as e from 'express';
import * as oCompetitionCtrl from '../controllers/CompetitionCtrl';
const router = e.Router();

router.post('/competition/register', oCompetitionCtrl.create);
router.get('/user/:userDocId/verification', oCompetitionCtrl.emailAuthentcationCallback);

export default router;