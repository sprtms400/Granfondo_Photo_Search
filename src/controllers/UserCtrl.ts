/**
 * @module
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
import oUserManager from '../managers/UserManager';

/**
 * @method POST
 * @params req express request object which continas new user information 
 * @params res express response object
 * 
 * @description Handles user registration. The expected contents of req.body are as follows:
 * @example
 * {
 *   "username": "user123", // A unique string representing the user's username.
 *   "password": "password", // A string representing the user's password.
 *   "email": "user@example.com" // A string representing the user's email address.
 * }
 */
export const create = function (req: e.Request, res: e.Response) {
    const oUserData = req.body || '';

    oUserManager.create( oUserData, function (errorCode, errorMessage, httpCode, errorDescription, user) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        const resUser: any = {};
        resUser.id = user._id;
        resUser.username = user.username;
        resUser.displayName = user.displayName;
        resUser.email = user.email;
        resUser.avatarUrl = user.avatarUrl;
        return oRest.sendSuccess(res, resUser, httpCode);
    });
}

/**
 * @method PATCH
 * @params req express request object which continas new user information 
 * @params res express response object
 * 
 * contents of req.body
 * body : {
 *      username : string,
 *      password : string,
 *      email : string,
 * }
 */
export const update = function (req: e.Request, res: e.Response) {
    const accessUserId
}