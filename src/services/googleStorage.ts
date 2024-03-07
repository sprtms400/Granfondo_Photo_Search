
/**
 * @file googleStorage.ts is a file which contains the google storage instance and bucket.
 * 
 * @description This file make connection with google cloud storage and create a bucket instance.
 */
import * as googleStorage from '@google-cloud/storage';
import config from '../config';

/** Google storage instance. */
const storage = new googleStorage.Storage({
    keyFilename: config.gcp.storageBucket.keyFilename,
    projectId: config.gcp.storageBucket.projectId
})

/** Google storage bucket. */
const bucket = storage.bucket(config.gcp.storageBucket.bucketName);

export const uploadImage = async function (file: Express.Multer.File, competition: string, photoId: string, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photoURL: string|null) => void) {
    const blob = bucket.file(competition + '/' + photoId);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });
    console.log('blobStream', blobStream)
    blobStream.on('error', (error: Error) => {
        console.log('error', error);
        return callback(23, 'upload_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    });
    blobStream.on('finish', () => {
        console.log('finish')
        const photoURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        return callback(null, null, 200, null, photoURL);
    });
    blobStream.end(file.buffer);
}