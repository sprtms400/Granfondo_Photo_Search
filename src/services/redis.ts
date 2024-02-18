/**
 * @file redis.ts is a file which contains the redis instance. BUT IT IS NOT USED IN THE PROJECT.
 * 
 * @description Originally, The redis will be use to store the email authentication information. 
 * but The strategy had changed and the redis is not used in the project. 
 * Authenticate process will be done by the JWT token.
 */
import redis from 'redis';
import config from '../config';
import * as utils from '../utils';

/** Create redis instance */
export const createInstance = async (type: string) => {
    const client = redis.createClient({
        socket: {
            host: config.redis.host,
            port: config.redis.port,
        }
    });
    client.on('error', (err) => {
        utils.logger.error('RedisDB throw error: ', err);
    });
    client.on('connect', () => {
        utils.logger.info(`RedisDB (${type}) connection established and ready.`);
    });
    await client.connect();
    return client;
};