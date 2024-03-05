import * as e from 'express';
import oRest = require('../utils/restware');
import oPhotoManager = require('../managers/PhotoManager');
/**
 * Purpose : Cotroller for photo service.
 * 
 * 1. Photo upload
 * 2. Photo search
 */

export const upload = function (req: e.Request, res: e.Response) {
}
export const search = function (req: e.Request, res: e.Response) {
}
/**
 * @method POST
 * @param req 
 * @param res 
 * @example
 * {
 *   "srcLink": "https://www.google.com/photo.jpg",
 *   "competition": "화천DMZ",
 *   "author": "홍길동",
 *   "photographedTime": "2018-01-01T00:00:00.000Z",
 *   "width": "1920",
 *   "height": "1080",
 *   "fileSize": "1024"
 * }
 * 
 */
export const initUpload = function (req: e.Request, res: e.Response) {
     /**
     * JWT Token validation required.
     */
     const userId = req.body.accessUserId;
     const metaData = req.body || {};

     if(!userId) {
          return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
     }
     if(!metaData.srcLink) {
          return oRest.sendError(res, 24, 'srcLink is required', 400, 'srcLink is required');
     }
     if(!metaData.competition) {
          return oRest.sendError(res, 24, 'competition is required', 400, 'competition is required');
     }
     if(!metaData.author) {
          return oRest.sendError(res, 24, 'author is required', 400, 'author is required');
     }
     if(!metaData.photographedTime) {
          return oRest.sendError(res, 24, 'photographedTime is required', 400, 'photographedTime is required');
     }
     if(!metaData.width) {
          return oRest.sendError(res, 24, 'width is required', 400, 'width is required');
     }
     if(!metaData.height) {
          return oRest.sendError(res, 24, 'height is required', 400, 'height is required');
     }
     if(!metaData.fileSize) {
          return oRest.sendError(res, 24, 'fileSize is required', 400, 'fileSize is required');
     }

     oPhotoManager.initUpload(metaData.srcLink, metaData.competition, metaData.author, metaData.photographedTime, metaData.width, metaData.height, metaData.fileSize, userId, 
     function (errorCode, shortMessage, httpCode, description, photo) {
          if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
          }
          if (photo) {
               const resPhoto: any = {}
               resPhoto.photoId = photo._id;
               return oRest.sendSuccess(res, resPhoto, httpCode);
          }
     });
}

/**
     * 
     * @method GET
     * @param req express request
     * @param res express response
     * 
     * Purpose : Get presigned url for photo upload to GCS, Before request this API, Meta data should be saved in mongodb.
     * @example
     * parameters : {
     *    photoId: "5d7e3f7b9f3e4d1f8c9e3f7b",
     * }
     */
export const getPresignedUrl = function (req: e.Request, res: e.Response) {
    /**
     * JWT Token validation required.
     */
    const userId = req.body.accessUserId;
    const photoId = req.params.photoId;
}

/**
     * 
     * @method POST
     * @param req express request
     * @param res express response
     * 
     * Purpose : Notify success of photo upload, It will be called after photo upload to GCS with presignedURL.
     * @example
     * {
     *    photoId: "5d7e3f7b9f3e4d1f8c9e3f7b",
     * }
     */
export const uploadSuccess = function (req: e.Request, res: e.Response) {
    /**
     * JWT Token validation required.
     */
    const userId = req.body.accessUserId;
    const photoId = req.params.photoId;
    if(!userId) {
        return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
    }
    if(!photoId) {
        return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
    }

    oPhotoManager.uploadSuccess(photoId, userId, function (errorCode, shortMessage, httpCode, description, photo) {
            if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
            }
            if (photo) {
               const resPhoto: any = {}
               resPhoto.photoId = photo._id;
               return oRest.sendSuccess(res, resPhoto, httpCode);
            }
    });
}