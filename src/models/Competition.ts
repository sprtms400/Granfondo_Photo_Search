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

export default Mongoose.model('competitions', CompetitionSchema);