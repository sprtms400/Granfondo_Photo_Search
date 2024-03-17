import * as Mongoose from 'mongoose';

interface IColor extends Mongoose.Document {
    color: string;
    RGBcode: {
        R: number,
        G: number,
        B: number
    }
    CIELABcode: {
        L: number,
        a: number,
        b: number
    }
}


const Schema = Mongoose.Schema;

const ColorSchema = new Schema({
    colorText: {
        type: String,
        required: true,
    },
    RGBcode: {
        R: {
            type: Number,
            required: true,
        },
        G: {
            type: Number,
            required: true,
        },
        B: {
            type: Number,
            required: true,
        }
    },
    CIELABcode: {
        L: {
            type: Number,
            required: true,
        },
        a: {
            type: Number,
            required: true,
        },
        b: {
            type: Number,
            required: true,
        }
    }
});

const Color = Mongoose.model<IColor>('colors', ColorSchema);
export { Color, IColor };