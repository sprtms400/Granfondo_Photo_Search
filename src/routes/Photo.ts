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
router.get('/photo/getPresignedUrl/:photoId', oPhotoCtrl.getPresignedUrl);

// 3. Notifying success of upload
router.post('/photo/uploadSuccess/:photoId', oPhotoCtrl.uploadSuccess);

// upload image through server, apply multer as middleware
router.post('/photo/upload', oMiddlewares.multerUploadOnMemory.single('file'), oPhotoCtrl.upload);
// router.post('/photo/upload_v2', oMiddlewares.multerUploadOnGCS.single('file'), oPhotoCtrl.upload);

/************************************************************************************************************ */
const express = require('express');
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
import config from '../config';

// Google Cloud Storage 설정
const storage = new Storage({
    keyFilename: config.gcp.storageBucket.keyFilename,
    projectId: config.gcp.storageBucket.projectId,
});
const bucket = storage.bucket(config.gcp.storageBucket.bucketName);

// Multer 설정 (메모리 스토리지 사용)
const upload = multer({
    storage: multer.memoryStorage(),
});


router.post('/testupload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // GCS에 업로드하기 위한 파일 생성
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    blobStream.on('error', (err: Error) => {
        console.error(err);
        return res.status(500).send('Something went wrong!');
    });

    blobStream.on('finish', () => {
        // 파일이 GCS에 업로드되었을 때의 처리
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send({url: publicUrl});
    });

    // 스트림을 통해 메모리상의 파일을 GCS로 업로드
    blobStream.end(req.file.buffer);
});
/************************************************************************************************************ */
export default router;