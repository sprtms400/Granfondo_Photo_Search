import * as e from 'express';
import oRest = require('../utils/restware');
import * as oCompetitionManager from '../managers/CompetitionManager'

export const create = function (req: any, res: any) {
    const accessUserID = req.body.accessUserID;
    const date = req.body.date;
    const name = req.body.name;
    const location = req.body.location;

    if (!accessUserID) {
        return oRest.sendError(res, 24, 'accessUserID is required', 400, 'accessUserID is required');
    }
    if (!date) {
        return oRest.sendError(res, 24, 'date is required', 400, 'date is required');
    }
    if (!name) {
        return oRest.sendError(res, 24, 'name is required', 400, 'name is required');
    }
    if (!location) {
        return oRest.sendError(res, 24, 'location is required', 400, 'location is required');
    }
    oCompetitionManager.create(accessUserID, date, name, location, function (errorCode, shortMessage, httpCode, description, competition) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
        }
        if (competition) {
            return oRest.sendSuccess(res, competition, httpCode);
        }
    });
}

export const getCompetitions = function (req: any, res: any) {
    const accessUserID = req.body.accessUserID;
    if (!accessUserID) {
        return oRest.sendError(res, 24, 'accessUserID is required', 400, 'accessUserID is required');
    }
    oCompetitionManager.getCompetitions(accessUserID, function (errorCode, shortMessage, httpCode, description, competitions) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
        }
        if (competitions) {
            return oRest.sendSuccess(res, competitions, httpCode);
        }
    });
}