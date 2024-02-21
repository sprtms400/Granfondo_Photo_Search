import fs from 'fs';
import Environment from './environment_interface';
//Environment variables not using now.

const oAuthSetting = JSON.parse(fs.readFileSync('keys/oAuthGmail.json', 'utf8'));

export default {
    servicename: 'GranfondoPhotoSearch',                // Service name.
    port: 3000,                                         // Port for the service.                             
    jwtAuthKey: 'goodluckgettingjob',                   // jwtAuthKey is required for jwt token generation it can be random.
    emailVerificationExpiryDay: 3,                      // Email verification expiry day. after that temporary user will be deleted automatically.
    paths: {
        tmp: '/tmp',
        asset: '/asset',
        docs: '/docs',
        dependencies: '/dependencies',
        tag: '/tag',
        fittingmedia: '/fittingmedia',
        dashboard: '/dashboard'
    },
    mongodb: {
        host: 'mongodb+srv://granfondophotosearch.jaaasch.mongodb.net/',
        db_name: 'GranfondoPhotoSearch',
        user: 'api_service',
        pass: 'GqW437E98CI2oogU'
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    /**
     * About GCP IAM Settings, refer to the following link.
     * https://cloud.google.com/iam/docs/keys-create-delete?hl=ko
     */
    gcp: {
        appEngine: {
        },
        storageBucket: {
            keyFilename: '../../../keys/granfondophotosearch-babc61c67a03.json',
            bucketName: 'granfondo-photos',
            projectId: 'granfondophotosearch',
        }
    },
    mailer: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        oauth: {
            type: oAuthSetting.oauth.type,
            user: oAuthSetting.oauth.user,
            clientId: oAuthSetting.oauth.clientId,
            clientSecret: oAuthSetting.oauth.clientSecret,
            refreshToken: oAuthSetting.oauth.refreshToken,
        },
        options: {
            from: 'sprtms400@gmail.com',
        }
    }
}