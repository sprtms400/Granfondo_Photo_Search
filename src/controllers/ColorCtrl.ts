import * as e from 'express';
import oRest = require('../utils/restware');
import * as oColorManager from '../managers/ColorManager';

export const create = function (req: any, res: any) {
    const color = req.body.color;
    if (!color) {
        return oRest.sendError(res, 24, 'color is required', 400, 'color is required');
    }
    oColorManager.create_color(color, function (errorCode, shortMessage, httpCode, description, color) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
        }
        if (color) {
            return oRest.sendSuccess(res, color, httpCode);
        }
    });
}

export const getColors = function (req: any, res: any) {
    oColorManager.get_colors(function (errorCode, shortMessage, httpCode, description, colors) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, shortMessage, httpCode, description);
        }
        if (colors) {
            return oRest.sendSuccess(res, colors, httpCode);
        }
    });
}