import Environment from './environment_interface';
//Environment variables not using now.

export default {
    servicename: 'GranfondoPhotoSearch',                // Service name.
    port: 3000,                                         // Port for the service.                             
    jwtAuthKey: 'goodlucktogetjob',                     // jwtAuthKey is required for jwt token generation it can be random.
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
    }
}