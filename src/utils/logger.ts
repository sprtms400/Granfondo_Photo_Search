import * as bunyan from 'bunyan';
import config from '../config';

// Create logger stream.
/**
 * Purpose : logging system for the service.
 * 
 * Bunyan supports multiple logging styles.
 * 1. streams
 * 2. path logging
 * 3. rotating path logging
 * 4. Remote logging System (Like elasticsearch)
 * 
 */
const streams: bunyan.Stream[] = [
    {
        stream: process.stdout,
        level: 'info'
    }
];

// Create logger for app.
const logger = bunyan.createLogger({
    name: config.servicename,
    streams: streams
});

export default logger;
