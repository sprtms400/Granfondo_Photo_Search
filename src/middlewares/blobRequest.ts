import multer from 'multer';
import multerGoogleStorage, { storageEngine } from 'multer-google-storage';
import config from '../config';
import { Request } from 'express';

export const multerUploadOnMemory = multer({
    storage: multer.memoryStorage(), // 메모리 스토리지 사용
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB 이하
    },
})

export const multerUploadOnGCS = multer({
    storage: storageEngine({
        bucket: config.gcp.storageBucket.bucketName,
        projectId: config.gcp.storageBucket.projectId,
        keyFilename: config.gcp.storageBucket.keyFilename,
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
            callback(null, `quizimage/${Date.now()}_${file.originalname}`);
        } ,
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 이하
    },
})