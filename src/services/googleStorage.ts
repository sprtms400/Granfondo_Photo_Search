
/**
 * @file googleStorage.ts is a file which contains the google storage instance and bucket.
 * 
 * @description This file make connection with google cloud storage and create a bucket instance.
 */
import * as googleStorage from '@google-cloud/storage';
import config from '../config';

/** Google storage instance. */
export const instance = new googleStorage.Storage({
    projectId: config.gcp.storageBucket.projectId,
});

/** Google storage bucket. */
export const cdnBucket = instance.bucket(config.gcp.storageBucket.bucketName);