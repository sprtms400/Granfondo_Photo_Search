import { IColor, Color as oColor} from '../models/Color'
import * as langchain from '../utils/langchain'

export const create_color = async function(color: string, 
    callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, color: IColor|null) => void) {
    try {   
        const small_color = color.toLowerCase();

        const colorExist = await oColor.findOne({colorText: small_color});
        if (colorExist) {
            return callback(24, 'color_exist', 400, 'Color already exists.', null);
        }

        const RGB = await langchain.llm_colorText_to_RGBcode(small_color);
        const CIELAB = await langchain.llm_colorText_to_CIELAB(small_color);
        const newColor = new oColor(
            {
                colorText: small_color,
                RGBcode: {
                    R: RGB.R,
                    G: RGB.G,
                    B: RGB.B
                },
                CIELABcode: {
                    L: CIELAB.L,
                    a: CIELAB.a,
                    b: CIELAB.b
                }
            }
        );
        newColor.save().then((color: IColor) => {
            return callback(null, null, 200, null, color);
        })
        .catch((error: any) => {
            console.log('error', error);
            return callback(24, 'create_color_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const get_colors = function(
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, colors: IColor[]|null) => void) {
    try {
        oColor.find().then((colors: IColor[]) => {
            return callback(null, null, 200, null, colors);
        })
        .catch((error: any) => {
            return callback(24, 'get_color_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }

}