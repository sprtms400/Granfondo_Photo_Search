import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

interface ICompetition extends Mongoose.Document {
    date: Date;
    name: string;
    location: string;
    createdDate: Date;
    updatedDate: Date;
}

const CompetitionSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    colortTemperature: {
        type: Number,       // Like 6500k
        required: false,
    },
    weather: {
        type: String,       // Like Sunny, Cloudy, Rainy
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
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

CompetitionSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;

    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
})

const Competition = Mongoose.model<ICompetition>('competitions', CompetitionSchema);
export { Competition, ICompetition }