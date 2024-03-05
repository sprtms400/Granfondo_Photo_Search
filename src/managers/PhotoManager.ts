import { Storage } from '@google-cloud/storage';
import { IPhoto, Photo as oPhoto } from '../models/Photo';
import { NumericLiteral } from 'typescript';

export const initUpload = function (srcLink: string, competition: string, author: string, photographedTime: string, width: number, height: number, fileSize: number, userId: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        const photo = new oPhoto({
            srcLink: srcLink,
            competition: competition,
            author: author,
            photographedTime: photographedTime,
            width: width,
            height: height,
            fileSize: fileSize,
            createdDate: new Date(),
            updatedDate: new Date(),
            uploader: userId
        });
        photo.save().then((photo: IPhoto) => {
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'save_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
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
        await oPhoto.findById(photoId).then(async (photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            const storage = new Storage({keyFilename: '../../keys/granfondophotosearch-babc61c67a03.json'})
            const bucketName = 'granfondo-photos';
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
            const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
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