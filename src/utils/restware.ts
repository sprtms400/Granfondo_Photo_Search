// third party components
import * as express from 'express';
import * as oFs from 'fs';
import logger from './logger';
const oPieces = require('./pieces');

/**
 * Purpose: Provide a standardized response handling mechanism.
 * It aims to simplify client-server communication by ensuring consistency in response formats and HTTP status codes.
 */

module.exports = {
    sendSuccess: function (res: express.Response, data: Object, iHttpCode?: number) {
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
    },
    sendError: function (res: express.Response, code: number, message: String, httpCode: number, description: String, errors: Error) {
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
    },

    /*
    sendSuccessToken: function (res: express.Response, token: String, user: any) {
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
    },
    */
};