import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const CompetitionSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});