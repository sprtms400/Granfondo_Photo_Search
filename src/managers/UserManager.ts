import oBcrypt from 'bcryptjs';
import { IUser, User as oUser } from '../models/User';
import reservedKeywords from '../utils/reservedKeywords';
import config from '../config';

export const create = function (userData: IUser, callback: (errorCode: number, errorMessage: string, httpCode: number, error: any, user: IUser|null) => void) {
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
            return callback(0, 'create_user_success', 200, null, user);
        })
        .catch((error: any) => {
            return callback(24, 'create_user_fail', 400, error, null);
        });
    } catch (error: any) {
        return callback(24, 'create_user_fail', 400, error, null);
    }
}

const authenticate = function (email: string, password: string, callback) { 

}