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

// Connect to mongoDB
mongoose.connect(config.mongodb.host, {
    dbName: config.mongodb.db_name,
    user: config.mongodb.user,
    pass: config.mongodb.pass
});

// Initialize http server.
const app = express();
// Apply server routes.
app.use(routes);
/**
 * Apply body parser  at middleware
 * 
 * After express 4.16+ version, body-parser is no longer needed.
 */
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.text({ type: 'text/html'}));
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// Serve static files from the parent directory of the current script.
// This makes files like images, CSS, and JavaScript accessible via HTTP.
// app.use(express.static(path.resolve(__dirname, '..')));
app.all('/v1/auth/*', middlewares.validateRequest);

const server = http.createServer(app);

// Listen http server.
server.listen(config.port, () => {
    utils.logger.info(
        `${config.servicename} API server is running on port ` + config.port
    );
})
.on('error', err => utils.logger.error(err));