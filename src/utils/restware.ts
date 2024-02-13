// third party components
import * as express from 'express';
import * as oFs from 'fs';
import logger from './logger';
const oPieces = require('./pieces');

const sendSuccess = function (res: express.Response, data: Object, iHttpCode?: number) {
    if (!res) {
        return;
    }

    const httpStatus = iHttpCode ? iHttpCode : 200;
    let out = null;

    if (data) {
        out = data;
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
};

const sendSuccessDownload = function (res: express.Response, absPath: String, isUrl: String) {
    let bFail = true;
    if (!res) {
        return;
    }

    if (isUrl) {
        if (absPath && typeof absPath === 'string') {
            const result = absPath.replace('storage.googleapis.com/', '');
            res.status(200);
            bFail = false;
            return res.redirect(result);
        }
    } else {
        if (oFs.existsSync(absPath)) {
            res.status(200);
            bFail = false;
            return res.download(absPath);
        }
    }

    if ( bFail ) {
        res.status(400);
    res.contentType('json');
    const out: any = {};
    out.code = 5002;
        out.message = 'unavailable_file';
        out.desc = 'the file does not exist';



    logger.info(JSON.stringify(out));
    return res.json(out);
    }
};

const sendSuccessWebContent = function (res: express.Response, data: Object, iHttpCode?: 200) {
    if (!res) {
        return;
    }

    const httpStatus = iHttpCode ? iHttpCode : 200;
    let out = null;

    if ( data ) {
        out = data;
    }

    res.status(httpStatus);
    res.contentType('text/html');
    return res.end(out);
};

/*
const sendSuccessToken = function (res: express.Response, token: String, user: any) {
    if (!res) {
        return;
    }

    const out: any = {};
    out.token = token;
    const defaultTotalDevice = oPieces.totalAddDevice(user.payLevel);
    if (user) {
        out.id = user._id;
        out.username = user.username;
        out.displayName = user.displayName;
        out.email = user.email;
        out.userRight = user.userRight;
        out.avatarUrl = user.avatarUrl;
        out.defLanguage = user.defLanguage;
        out.payLevel = user.payLevel;
        out.payPeriod = user.payPeriod;
        out.expiredDate = user.expiredDate;
        out.lastAccessDate = user.lastAccessDate;
        out.updatedDate = user.updatedDate;
        out.totalStorage = user.totalStorage;
        out.totalDevice = user.totalDevice && user.totalDevice > defaultTotalDevice ? user.totalDevice : defaultTotalDevice;
    }
    res.status(200);
    res.contentType('json');
    return res.json(out);
};
*/
const sendError = function (res: express.Response, code: number, message: String, httpCode: number, description: String, errors: Error) {
    if (!res) {
        return;
    }

    const out: any = {};
    out.code = code;
    out.message = message ? message.toString() : 'none';

    // if (process.env.NODE_ENV !== 'production') {
        if (description) {
            out.desc = description.toString();
        } else if (errors) {
            out.errors = errors;
        }
    // }

    logger.info(out);

    const status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(out);
};

module.exports = {
    sendSuccess: sendSuccess,
    sendError: sendError,
    // sendSuccessToken: sendSuccessToken,
    sendSuccessDownload: sendSuccessDownload,
    sendSuccessWebContent: sendSuccessWebContent
};
