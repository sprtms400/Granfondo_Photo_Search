import * as e from 'express';
import * as jwt from 'jsonwebtoken';

const oUserManager = require('../manager/UserManager');
const oRest = require('../utils/restware');
import config from '../config';


export function validateRequest(req: e.Request, res: e.Response, next: e.NextFunction) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token: string =
            (req.body && req.body.access_token) ||
            (req.query && req.query.access_token) ||
            req.headers['x-access-token'];
        if (!token) {
            throw new Error();
        }

        // Check whether token valid or not.
        const decoded: any = jwt.verify(token, config.jwtAuthKey);
        if (!decoded) {
            throw new Error();
        }
        oUserManager.checkUserValidAvailable(decoded.id, decoded.userRight, decoded.username, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            if (req.method === 'GET') {
                req.query.accessToken = token;
                req.query.accessUserId = decoded.id;
                req.query.accessUserRight = decoded.userRight;
                req.query.accessUserName = decoded.username;
                req.query.accessUserECointX = user.eCoinX;
                req.query.accessUserECointY = user.eCoinF;
                req.query.accessUserTotalStorage = user.totalStorage;
                req.query.accessUserTotalDevice = user.totalDevice;
                req.query.accessUserUsedStorage = user.usedStorage;
                req.query.accessUserLang = user.defLanguage;
                req.query.accessUserPayLevel = user.payLevel;
                req.query.accessUserExpiredDate = user.expiredDate;

                if (user.agent && user.agent.id) {
                    req.query.agent = user.agent.id;
                }
                if (user.master && user.master.id) {
                    req.query.master = user.master.id;
                }
            } else {
                req.body.accessToken = token;
                req.body.accessUserId = decoded.id;
                req.body.accessUserRight = decoded.userRight;
                req.body.accessUserName = decoded.username;
                req.body.accessUserECoinX = user.eCoinX;
                req.body.accessUserECoinF = user.eCoinF;
                req.body.accessUserTotalStorage = user.totalStorage;
                req.body.accessUserTotalDevice = user.totalDevice;
                req.body.accessUserUsedStorage = user.usedStorage;
                req.body.accessUserLang = user.defLanguage;
                req.body.accessUserPayLevel = user.payLevel;
                req.body.accessUserExpiredDate = user.expiredDate;

                if (user.agent && user.agent.id) {
                    req.body.accessUserAgent = user.agent.id;
                }
                if (user.master && user.master.id) {
                    req.body.accessUserMaster = user.master.id;
                }
            }
            next();
        });
    } catch (err) {
        return oRest.sendError(res, 5170, 'verify_token_fail', 500, err);
    }
}
