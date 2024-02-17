import { IUser, User as oUser } from '../models/User';

export const checkUserValidAvailable = function (userEmail: String, callback) {
    try {
        oUser.findOne({email: userEmail}, function (error: Error, user: IUser) {
            if (error) {
                return callback(24, 'check_user_valid_fail', 404, error, null);
            }
            if (!user) {
                return callback(24, 'check_user_valid_fail', 404, null, null);
            }
            return callback(0, 'check_user_valid_success', 200, null, user);
        });
    } catch (error) {
        return callback(24, 'check_user_valid_fail', 400, error, null);
    }
}