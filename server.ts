import path from 'path'
import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import mongoose from 'mongoose'
import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors';

import routes from './src/routes';
import config from './src/config';

// Connect to mongoDB
mongoose.connect(config.mongodb.host, {
    dbName: config.mongodb.db_name,
    user: config.mongodb.user,
    pass: config.mongodb.pass
});

// Initialize http server.
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.text({ type: 'text/html'}));

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// Serve static files from the parent directory of the current script.
// This makes files like images, CSS, and JavaScript accessible via HTTP.
// app.use(express.static(path.resolve(__dirname, '..')));