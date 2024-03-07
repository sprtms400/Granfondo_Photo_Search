import * as e from 'express';
import oRest = require('../utils/restware');
import oPhotoManager = require('../managers/PhotoManager');
import { access } from 'fs';
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
     if(!metaData.photoId) {
          return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
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

     oPhotoManager.initUpload(userId, metaData.phtoId, metaData.srcLink, metaData.competition, metaData.author, metaData.photographedTime, metaData.width, metaData.height, metaData.fileSize, userId, 
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

export const upload = function (req: e.Request, res: e.Response) {
     const accessUserId = req.body.accessUserId;
     const file = req.file;
     const photoId = req.body.photoId;
     const competition = req.body.competition;
     const author = req.body.author;
     const photographedTime = req.body.photographedTime;
     const srcLink = req.body.srcLink;

     if(!accessUserId) {
          return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
     }
     if(!file) {
          return oRest.sendError(res, 24, 'file is required', 400, 'file is required');
     }
     if(!photoId) {
          return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
     }
     if(!competition) {
          return oRest.sendError(res, 24, 'competition is required', 400, 'competition is required');
     }
     if(!author) {
          return oRest.sendError(res, 24, 'author is required', 400, 'author is required');
     }
     if(!photographedTime) {
          return oRest.sendError(res, 24, 'photographedTime is required', 400, 'photographedTime is required');
     }
     if(!srcLink) {
          return oRest.sendError(res, 24, 'srcLink is required', 400, 'srcLink is required');
     }

     oPhotoManager.upload(accessUserId, file, photoId, competition, author, photographedTime, srcLink, function (errorCode, shortMessage, httpCode, description, photoURL) {
          if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
          }
          if (photoURL) {
               return oRest.sendSuccess(res, photoURL, httpCode);
          }
     });
}

export const getPhoto = function (req: e.Request, res: e.Response) {
     // const accessUserId = req.body.accessUserId;
     const photoId = req.params.photoId;
     // if(!accessUserId) {
     //      return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
     // }
     if(!photoId) {
          return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
     }
     oPhotoManager.getPhoto(photoId, function (errorCode, shortMessage, httpCode, description, photo) {
          if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
          }
          if (photo) {
               return oRest.sendSuccess(res, photo, httpCode);
          }
     });
}

export const updateAppearance = function (req: e.Request, res: e.Response) {
     const accessUserId = req.body.accessUserId;
     const photoId = req.body.photoId;
     const appearance = req.body.appearance;
     if(!accessUserId) {
          return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
     }
     if(!photoId) {
          return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
     }
     if(!appearance) {
          return oRest.sendError(res, 24, 'appearance is required', 400, 'appearance is required');
     }
     oPhotoManager.updateAppearance(accessUserId, photoId, appearance, function (errorCode, shortMessage, httpCode, description, appearance) {
          if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
          }
          if (appearance) {
               return oRest.sendSuccess(res, appearance, httpCode);
          } 
     });
}

export const updateNumberPlate = function (req: e.Request, res: e.Response) {
     const accessUserId = req.body.accessUserId;
     const photoId = req.body.photoId;
     const numberPlate = req.body.numberPlate;
     if(!accessUserId) {
          return oRest.sendError(res, 24, 'user is required', 400, 'user is required');
     }
     if(!photoId) {
          return oRest.sendError(res, 24, 'photoId is required', 400, 'photoId is required');
     }
     if(!numberPlate) {
          return oRest.sendError(res, 24, 'numberPlate is required', 400, 'numberPlate is required');
     }
     oPhotoManager.updateNumberPlate(accessUserId, photoId, numberPlate, function (errorCode, shortMessage, httpCode, description, numberPlate) {
          if(errorCode) {
               return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
          }
          if (numberPlate) {
               return oRest.sendSuccess(res, numberPlate, httpCode);
          }
     });
}