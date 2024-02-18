// third party components
import * as e from 'express';
import * as oFs from 'fs';
import logger from './logger';
const oPieces = require('./pieces');

/**
 * Purpose: Provide a standardized response handling mechanism.
 * It aims to simplify client-server communication by ensuring consistency in response formats and HTTP status codes.
 */

/**
 * 
 * @param res       express response
 * @param data      data object
 * @param httpCode  http status code
 * @returns 
 */
export const sendSuccess = function (res: e.Response, data: Object, httpCode?: number) {
    if (!res) {
        return;
    }

    const httpStatus = httpCode ? httpCode : 200;
    let out = null;

    if (data) {
        out = data;
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
}

/**
 * 
 * @param res           express response
 * @param code          error code
 * @param message       error message
 * @param httpCode      http status code
 * @param description   error description
 * @param errors        error object but you can send in optional
 * @returns 
 */
export const sendError = function (res: e.Response, code: number, message: string, httpCode: number, description: string, errors?: Error) {
    if (!res) {
        return;
    }

    const out: any = {};
    out.code = code;
    out.message = message ? message.toString() : 'none';
    out.desc = description.toString();

    if (errors) {
        out.errors = errors;
    }

    logger.info(out);

    const status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(out);
}

// export const sendSuccessToken = function (res: e.Response, token: string, user: any) {
//     if (!res) {
//         return;
//     }

//     const out: any = {};
//     out.token = token;
//     const defaultTotalDevice = oPieces.totalAddDevice(user.payLevel);
//     if (user) {
//         out.id = user._id;
//         out.username = user.username;
//         out.displayName = user.displayName;
//         out.email = user.email;
//         out.userRight = user.userRight;
//         out.avatarUrl = user.avatarUrl;
//         out.defLanguage = user.defLanguage;
//         out.payLevel = user.payLevel;
//         out.payPeriod = user.payPeriod;
//         out.expiredDate = user.expiredDate;
//         out.lastAccessDate = user.lastAccessDate;
//         out.updatedDate = user.updatedDate;
//         out.totalStorage = user.totalStorage;
//         out.totalDevice = user.totalDevice && user.totalDevice > defaultTotalDevice ? user.totalDevice : defaultTotalDevice;
//     }
//     res.status(200);
//     res.contentType('json');
//     return res.json(out);
// }