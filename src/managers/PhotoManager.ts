import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';
import { IPhoto, Photo as oPhoto } from '../models/Photo';
import config from '../config';

const makeMetaData = function (userId: string, photoId: string, srcLink: string, competition: string, author: string, photographedTime: string, width: number|null, height: number|null, fileSize: number|null, fileType: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        const photo = new oPhoto({
            photoId: photoId,
            srcLink: srcLink,
            competition: competition,
            author: author,
            photographedTime: photographedTime,
            width: width,
            height: height,
            fileSize: fileSize,
            fileType: fileType,
            createdDate: new Date(),
            updatedDate: new Date(),
            // uploader: userId
        });
        photo.save().then((photo: IPhoto) => {
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(24, 'save_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

// export const initUpload = function (srcLink: string, competition: string, author: string, photographedTime: string, width: number, height: number, fileSize: number, userId: string,
//         callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
//     try {
//         const photo = new oPhoto({
//             srcLink: srcLink,
//             competition: competition,
//             author: author,
//             photographedTime: photographedTime,
//             width: width,
//             height: height,
//             fileSize: fileSize,
//             createdDate: new Date(),
//             updatedDate: new Date(),
//             uploader: userId
//         });
//         photo.save().then((photo: IPhoto) => {
//             return callback(null, null, 200, null, photo);
//         })
//         .catch((error: Error) => {
//             return callback(24, 'save_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
//         });
//     } catch (error) {
//         return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
//     }

// }

// Code conventioned
export const initUpload = function (userId: string, photoId: string, srcLink: string, competition: string, author: string, photographedTime: string, width: number, height: number, fileSize: number, fileType: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        makeMetaData(userId, photoId, srcLink, competition, author, photographedTime, width, height, fileSize, fileType, function (errorCode, shortMessage, httpCode, description, photo) {
            if(errorCode) {
                return callback(errorCode, shortMessage, httpCode, description, null);
            }
            if(photo) {
                return callback(null, null, 200, null, photo);
            }
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}


export const getPresignedUrl = async function (photoId: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, url: string|null) => void) {
    try {
        // 1. find photo meta data in mongodb
        // 2. generate presigned url
        // 업로드 되는 디렉토리 위치 설정을 변경할 필요가 존재함.
        await oPhoto.findOne({'photoId': photoId}).then(async (photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            const storage = new Storage({keyFilename: config.gcp.storageBucket.keyFilename})
            const bucketName = config.gcp.storageBucket.bucketName;
            const bucket = storage.bucket(bucketName);
            const fileName = photoId;
            const options: {
                version: 'v4' | 'v2' | undefined;
                action: 'write' | 'read' | 'delete' | 'resumable';
                expires: number;
                contentType: string;
            } = {
                version: 'v4',
                action: 'write',
                expires: Date.now() + 15 * 60 * 1000, // url available in 15 minutes
                contentType: 'application/octet-stream',
            };

            const [url] = await bucket.file(fileName).getSignedUrl(options);
            return callback(null, null, 200, null, url);
            
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const uploadSuccess = function (photoId: string, userId: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findByIdAndUpdate({_id: photoId, uploader: userId}, {uploadSucess: true}).then((photo: IPhoto|null) => {
            if(!photoId) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'update_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * upload photo to google cloud storage
 */
export const upload = async function (accessUserId: string, file: Express.Multer.File, photoId: string, competition: string, author: string, photographedTime: string, srcLink: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photoUrl: string|null) => void) {
    try {
        /**
         * 1. file에서 메타데이터 추출
         * 2. Meta데이터 추출 및 db에 저장
         * 3. Google Cloud Storage에 업로드
         */
        // 1
        let width: number = 0
        let height: number = 0
        let fileSize: number = 0
        let fileType: string = ''
        await sharp(file.buffer)
        .metadata()
        .then((metadata) => {
            width = metadata.width ? metadata.width : 0;
            height = metadata.height ? metadata.height : 0;
            fileSize = metadata.size ? metadata.size : 0;
            fileType = metadata.format ? metadata.format : '';
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(22, 'metadata_extraction_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
        // 2
        await makeMetaData(accessUserId, photoId, srcLink, competition, author, photographedTime, width, height, fileSize, fileType, function (errorCode, shortMessage, httpCode, description, photo) {
            if (errorCode) {
                return callback(errorCode, shortMessage, httpCode, description, null);
            }
        });

        // 3 
        const storage = new Storage({
            keyFilename: config.gcp.storageBucket.keyFilename,
            projectId: config.gcp.storageBucket.projectId
        })
        const bucket = storage.bucket(config.gcp.storageBucket.bucketName);
        // bucket.exists().then((data) => {
        //     const exists = data[0];
        //     if (exists) {
        //         console.log('bucket exists')
        //     } else {
        //         console.log('bucket not exists')
        //     }
        // })
        // .catch(err => {
        //     console.error('Error checking bucket:', err);
        //   });
        // console.log('bucket', bucket)
        const blob = bucket.file(competition + '/' + photoId);
        // console.log('blob', blob)
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
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}
