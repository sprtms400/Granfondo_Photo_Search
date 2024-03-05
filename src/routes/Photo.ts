import * as e from 'express';
import * as oPhotoCtrl from '../controllers/PhotoCtrl';

const router = e.Router();

// Get upload photo
// router.post('/v1/upload/photo')


/**
 * == Upload process brothers ==
 * User can upload photo by following steps
 * Basically user directly upload to GCS
 * 
 * 1. Initiate upload process
 * 2. getPresignedUrl
 * 3. to notify success of upload
 */
// 1. Initiate upload process
router.post('/photo/initUpload', oPhotoCtrl.initUpload);

// 2. Getting PresignedUrl
router.get('/photo/getPresignedUrl/:photoId', oPhotoCtrl.getPresignedUrl);

// 3. Notifying success of upload
router.post('/photo/uploadSuccess/:photoId', oPhotoCtrl.uploadSuccess);

// upload bulk image through server
// router.post('/photo/upload', oPhotoCtrl.upload);
export default router;