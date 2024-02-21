import * as e from 'express';
import * as jwt from 'jsonwebtoken';
import * as oUserManager from '../managers/UserManager';
import { IUser } from '../models/User';
import * as oRest from '../utils/restware';
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
        oUserManager.checkUserValidAvailable(decoded.id, decoded.email, function (errorCode: number|null, shortMessage: string|null, httpCode: number, description: any, user: IUser|null) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
            }
            if (req.method === 'GET') {
                req.query.accessToken = token;
                req.query.accessUserId = decoded.id;
                req.query.accessUserEmail = decoded.accessUserEmail;
                req.query.accessUserName = decoded.username;
            } else {    // Other else like POST, PUT, DELETE ...etc.
                req.body.accessToken = token;
                req.body.accessUserId = decoded.id;
                req.body.accessUserEmail = decoded.accessUserEmail;
                req.body.accessUserName = decoded.username;
            }
            next();
        });
    } catch (error) {
        return oRest.sendError(res, 5170, 'verify_token_fail', 500, 'An error occurred while verifying the token. Please contact the administrator.');
    }
}
