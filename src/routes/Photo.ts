import * as e from 'express';
import * as oPhotoCtrl from '../controllers/PhotoCtrl';
import * as oMiddlewares from '../middlewares';

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
// router.get('/photo/getPresignedUrl/:photoId', oPhotoCtrl.getPresignedUrl);
router.post('/photo/getPresignedUrl', oPhotoCtrl.getPresignedUrl_dev);

// 3. Notifying success of upload
router.post('/photo/uploadSuccess/:photoId', oPhotoCtrl.uploadSuccess);

// upload image through server, apply multer as middleware
router.post('/photo/upload', oMiddlewares.multerUploadOnMemory.single('file'), oPhotoCtrl.upload);

// Get all photos
router.get('/photos', oPhotoCtrl.getPhotos);

// Get photo Information by photoId
router.get('/photo/:photoId', oPhotoCtrl.getPhoto);

// Update analysis result of photo about appearance
router.post('/photo/:photoId/appearance', oPhotoCtrl.updateAppearance);
// Update analysis result of photo about number plate
router.post('/photo/:photoId/numberPlate', oPhotoCtrl.updateNumberPlate);

router.patch('/photo/:photoId/checkNumberPlateAnalyzed', oPhotoCtrl.checkNumberPlateAnalyzed);
router.patch('/photo/:photoId/checkAppearanceAnalyzed', oPhotoCtrl.checkAppearanceAnalyzed);

router.post('/photo/search', oPhotoCtrl.searchPhoto);

export default router;