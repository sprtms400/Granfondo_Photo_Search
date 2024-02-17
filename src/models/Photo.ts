import * as Mongoose from 'mongoose';
import reservedKeywords from '../utils/reservedKeywords';

/**
 * Define interface for user model
 */
interface IPhoto extends Mongoose.Document {
    srcLink: string;
    competition: string;
    author: string;
    photographedTime: Date;
    md5: string;
    width: number;
    height: number;
    size: number;
    hasThumbnail: boolean;
    createdDate: Date;
    updatedDate: Date;
}

/**
 * Define user schema and set middleware function.
 */
const Schema = Mongoose.Schema;

const PhotoSchema = new Schema({
    /**
     * id field automatically generated by mongoDB
     */
    srcLink: {
        type: String,
        required: true,
        unique: true,
    },
    competition: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
        unique: true,
    },
    photographedTime: {
        type: Date,
        required: true,
        unique: true,
    },
    md5: {
        type: String,
        required: true,
        unique: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    hasThumbnail: {
        type: Boolean,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

/**
 * Modle Middle ware function setting
 */
PhotoSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;

    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
})

const Photo = Mongoose.model<IPhoto>('photos', PhotoSchema);
export { Photo, IPhoto };