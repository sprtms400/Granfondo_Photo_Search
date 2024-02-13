import * as Mongoose from 'mongoose';
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

module.exports = Mongoose.model('photos', PhotoSchema);