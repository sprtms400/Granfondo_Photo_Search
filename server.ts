import dotenv from 'dotenv'         // Get env variables using dotenv package
// dotenv.config()
// const openai_api_key: string | undefined = process.env.OPENAI_API_KEY;
// const pinecone_api_key: string | undefined = process.env.PINECONE_API_KEY;
import path from 'path'
import * as fs from 'fs'
import redis from 'redis'
import mongoose from 'mongoose'
import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors';

import routes from './src/routes';
import * as middlewares from './src/middlewares';
import config from './src/config';
import * as utils from './src/utils';
import exp from 'constants'

import { readKey_openai, readKey_pinecone, readKey } from './keys/keyManager';
import { pineconeDB } from './src/utils';
import { langchain } from './src/utils';

async function start_server() {
    try {
        await readKey('./keys/openai.json').then((key) => {
            console.log('openai key:', key);
            langchain.init_langchain(key);
        })
        .catch((error) => {
            console.error('error:', error);
            throw new Error('openai key is empty');
        });
        
        await readKey('./keys/pinecone.json').then((key) => {
            console.log('pinecone key:', key);
            pineconeDB.init_pinecone(key);
        })
        .catch((error) => {
            console.error('error:', error);
            throw new Error('pinecone key is empty');
        });

        // dotenv key management
        // langchain.init_langchain(openai_api_key)
        // pineconeDB.init_pinecone(pinecone_api_key)
        
        // Connect to mongoDB
        await mongoose.connect(config.mongodb.host, {
            dbName: config.mongodb.db_name,
            user: config.mongodb.user,
            pass: config.mongodb.pass
        })
        .catch((error) => {
            console.error('error:', error);
            throw new Error('mongoDB connection failed');
        });

        // Initialize http server.
        const app = express();
        /**
         * Apply body parser  at middleware
         * 
         * After express 4.16+ version, body-parser is no longer needed.
         */
        app.use(express.json({ limit: '5mb' }));
        app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        app.use(express.text({ type: 'text/html'}));

        // CORS setting
        const corsOptions = {
            origin: ['http://localhost:3000', 'http://localhost:8080', 'https://app.granphotossearch.com', 'https://api.granphotossearch.com'],
            optionsSuccessStatus: 200
        }
        app.use(cors(corsOptions));
        // Serve static files from the parent directory of the current script.
        // This makes files like images, CSS, and JavaScript accessible via HTTP.
        // app.use(express.static(path.resolve(__dirname, '..')));
        app.all('/v1/auth/*', middlewares.validateRequest);
        app.use(routes);

        const server = http.createServer(app);

        // Listen http server.
        server.listen(config.port, () => {
            utils.logger.info(
                `${config.servicename} API server is running on port ` + config.port
            );
        })
        .on('error', err => utils.logger.error(err)); 
    } catch (error) {
        console.error('error:', error);
        return
    }

}

start_server();

// readKey('./keys/openai.json').then((key) => {
//     console.log('key:', key);
//     process.env.OPENAI_API_KEY = key;
// })

// readKey('./keys/pinecone.json').then((key) => {
//     console.log('key:', key);
//     process.env.PINECONE = key;
// })

// // Connect to mongoDB
// mongoose.connect(config.mongodb.host, {
//     dbName: config.mongodb.db_name,
//     user: config.mongodb.user,
//     pass: config.mongodb.pass
// });

// // Initialize http server.
// const app = express();
// /**
//  * Apply body parser  at middleware
//  * 
//  * After express 4.16+ version, body-parser is no longer needed.
//  */
// app.use(express.json({ limit: '5mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(express.text({ type: 'text/html'}));
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions));
// // Serve static files from the parent directory of the current script.
// // This makes files like images, CSS, and JavaScript accessible via HTTP.
// // app.use(express.static(path.resolve(__dirname, '..')));
// app.all('/v1/auth/*', middlewares.validateRequest);
// app.use(routes);

// const server = http.createServer(app);

// // Listen http server.
// server.listen(config.port, () => {
//     utils.logger.info(
//         `${config.servicename} API server is running on port ` + config.port
//     );
// })
// .on('error', err => utils.logger.error(err)); 
