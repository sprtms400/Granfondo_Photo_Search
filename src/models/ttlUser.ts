/**
 * @file ttlUser.ts is a model for ttlUser collection.
 * @description It is used to define the Time To Live (TTL) index for the user collection.
 * This collection will be use to store un-authenticated user information in temporary.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ttlUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true,
        unique: false,
    },
    pssword: {
        type: String,
        minlength: 4,
        maxlength: 128,
        required: true,
    },
    // createdAt field will be use to set the TTL index.
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24,
    },
});

export const Session = mongoose.model('ttlUser', ttlUserSchema);
