/**
 * @module User
 * @file UserCtrl.ts is a controller file which contains the methods to handle the user related operations
 * 
 * @description Validates user input against a predefined schema.
 * It checks for required fields, data types, and custom validation rules.
 * Returns an object with validation results, including any errors. 
 * and using middleware to verify right access.
 * 
 */
import * as e from 'express';
import * as oRest from '../utils/restware';
import * as oPieces from '../utils/pieces';
import * as oUserManager from '../managers/UserManager';
import { IUser } from '../models/User';

/**
 * @method POST
 * @params req express request object which continas new user information 
 * @params res express response object
 * 
 * @description Handles user registration api will send verification mail to user. The expected contents of req.body are as follows:
 * @example
 * {
 *   "email": "user@example.com" // A string representing the user's email address.
 *   "username": "user123", // A unique string representing the user's username.
 *   "password": "password", // A string representing the user's password.
 * }
 */
export const create = function (req: e.Request, res: e.Response) {
    const oUserData = req.body || '';

    if(!oUserData) {
        return oRest.sendError(res, 24, 'Invalid data', 400, 'Data is not provided');
    }
    if(!oUserData.username || oUserData.username.length < 4 || oUserData.username.length > 64) {
        return oRest.sendError(res, 24, 'Invalid username', 400, 'Given username is not provided or does not meet the format');
    }
    if(!oUserData.password || oUserData.password.length < 4 || oUserData.password.length > 128) {
        return oRest.sendError(res, 24, 'Invalid password', 400, 'Given password is not provided or does not meet the format');
    }
    if(!oUserData.email || oUserData.email.length < 4 || oUserData.email.length > 128 || oPieces.isValidEmail(oUserData.email) === false){
        return oRest.sendError(res, 24, 'Invalid email', 400, 'Given email is not provided or does not meet the format');
    }

    oUserManager.create( oUserData, function (errorCode: number, errorMessage: string, httpCode: number, errorDescription: any, user: IUser|null) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        if (user) {
            const resUser: any = {};
            resUser.id = user._id;
            resUser.username = user.username;
            resUser.email = user.email;
            return oRest.sendSuccess(res, resUser, httpCode);
        }
    });
}

/**
 * 
 * @param req 
 * @param res 
 */
export const emailAuthentcationCallback = function (req: e.Request, res: e.Response) {

}

/**
 * @method POST
 * @params req express request object which continas new user information 
 * @params res express response object
 * 
 * @description Request to reset user password. The expected contents of req.body are as follows:
 * @example
 * {
 *   "email": "user@example.com" // A string representing the user's email address.
 * }
 */
export const requestPasswordReset = function (req: e.Request, res: e.Response) {
    const oUserData = req.body || '';

}


/**
 * @method PATCH
 * @params req express request object continas new password to update.
 * @params res express response object
 * 
 * @description Handles user password reset. The expected contents of req.body are as follows:
 * body : {
 *   "email": "user@example1.com" // A string representing the user's email address.
 *   "password": "password", // A string representing the user's password.
 * }
 */
/*
export const updatePassword = function (req: e.Request, res: e.Response) {
    const oUserData = req.body || '';

    if(!oUserData) {
        return oRest.sendError(res, 400, 'Invalid data', 400, 'Invalid data');
    }
    if(!oUserData.password) {
        return oRest.sendError(res, 400, 'Invalid password', 400, 'Invalid password');
    } 
}
*/