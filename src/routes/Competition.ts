import * as e from 'express';
import * as oCompetitionCtrl from '../controllers/CompetitionCtrl';
const router = e.Router();

router.post('/competition/register', oCompetitionCtrl.create);
router.get('/competitions', oCompetitionCtrl.getCompetitions);

export default router;