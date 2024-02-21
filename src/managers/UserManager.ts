import oBcrypt from 'bcryptjs';
import { IUser, User as oUser } from '../models/User';
import reservedKeywords from '../utils/reservedKeywords';
import config from '../config';
import * as oService from '../services';

/**
 * 
 * @param userData User data object for registration
 * @param callback Callback function for to notify the result 
 * @returns callback()
 * 
 * @description This function is used to create a new user. The expected contents of userData are as follows:
 * @example
 * {
 *   "email": "user@example.com" // A string representing the user's email address.
 *   "username": "user123", // A unique string representing the user's username.
 *   "password": "password", // A string representing the user's password.
 * }
 */
export const create = function (userData: IUser, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, user: IUser|null) => void) {
    try {
        const user = new oUser(
            {
                email: userData.email,
                username: userData.username,
                password: oBcrypt.hashSync(userData.password),
                status: reservedKeywords.userStatusEnum[0],
            }
        );
        user.save().then((user: IUser) => {
            /**
             * Send mail to user for account verification
             * oService.mailer(user.email, user._id); ...
             */
            return callback(null, null, 200, null, user);
        })
        .catch((error: any) => {
            return callback(24, 'create_user_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * 
 * @param email Email address of the user
 * @param password Plane password of the user
 * @param callback Callback function for to notify the result 
 * @returns callback()
 * 
 * @description This function is used to login a user compare between db password and provied password. 
 * The expected contents of email and password are as follows:
 * @example
 * {
 *   "email": "user@example.com" // A string representing the user's email address.
 *   "password": "password",     // A string representing the user's password.
 * }
 */
export const login = function (email: string, password: string, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, user: IUser|null) => void) {
    try {
        oUser.findOne( {email: email}, function (error: Error, user: IUser) {
            if (error) {
                return callback(24, 'find_user_fail_for_login', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
            }
            if (user) {
                if (user.status !== reservedKeywords.userStatusEnum[0]) {
                    return callback(24, 'unactivated_user', 403, 'User is not availabe.', null);
                } else {
                    oBcrypt.compare(password, user.password, function (error, result) {
                        if (result === true) {
                            return callback(null, null, 200, null, user);
                        } else {
                            return callback(24, 'wrong_password', 422, 'Given password is wrong.', null);
                        }
                    });
                }
            } else {
                return callback(24, 'find_user_fail_for_login', 404, 'Unable to find the user.', null);
            }
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * 
 * @param userDocId userDoc Id of the user
 * @param callback Callback function for to notify the result 
 * @returns callback()
 * 
 * @decription This function is used to activate the user account after email verification.
 */
export const emailAuthentcationCallback = function (userDocId: string, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, user: IUser|null) => void) { 
    try {
        oUser.findOneAndUpdate(
            {id: userDocId}, 
            {
                status: reservedKeywords.userStatusEnum[1], 
                expireAt: new Date(9999, 12,31)
            }, function (error: Error, user: IUser) {
                if (error) {
                    return callback(24, 'update_user_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
                }
                if (user) {
                    return callback(null, null, 200, null, user);
                } else {
                    return callback(24, 'update_user_fail', 404, 'Unable to find the user.', null);
                }
        }); 
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * 
 * @param userDocId userDoc Id of the user
 * @param email user email
 * @param callback Callback function for to notify the result 
 * @returns callback()
 * 
 * @description This function is used to authenticate communications that include a JWT token.
 */
export const checkUserValidAvailable = function (userDocId: string, email: string, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, user: IUser|null) => void) {
    try {
        oUser.findOne({id: userDocId, email: email }, function (error: Error, user: IUser) {
            if (error) {
                return callback(24, 'find_user_fail_for_verification', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
            }
            if (user) {
                return callback(null, null, 200, null, user);
            } else {
                return callback(24, 'find_user_fail_for_verification', 404, 'Unable to find the user associated with the provided token.', null);
            }
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}