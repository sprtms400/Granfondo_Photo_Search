import * as e from 'express';
import * as oPhotoCtrl from '../controllers/PhotoCtrl';

const router = e.Router();

// Get upload photo
// router.post('/v1/upload/photo')

// 1. Initiate upload process
router.post('/photo/initUpload', oPhotoCtrl.initUpload);

// 2. getPresignedUrl
router.get('/photo/getPresignedUrl', oPhotoCtrl.getPresignedUrl);

export default router;