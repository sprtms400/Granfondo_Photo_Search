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
export const initUpload = function (req: e.Request, res: e.Response) {
}

/**
     * 
     * @param req express request
     * @param res express response
     * 
     * Purpose : Get presigned url for photo upload to GCS
     */
export const getPresignedUrl = function (req: e.Request, res: e.Response) {
    /**
     * JWT Token validation required.
     */
}