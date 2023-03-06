const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    followers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
    },
    following: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
    },
    subGreddiits: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'SubGreddiit'
        }]
    },
    saved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
    },

});

const subGreddiitSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags:{
        type: String,
        required: true,
    },
    banned: {
        type: String,
        required: true,
    },
    people:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
    },
    left: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
    },
    requests:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
    },
    posts:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        required: true,
    },
    reports: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Report'
        }],
        required: true,
    }

    
});

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
        //unique: true,
    },
    postedby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postedin: {
        type: Schema.Types.ObjectId,
        ref: 'SubGreddiit',
        required: true
    },
    upvotes:{
        type: Number,
        required: true,
    },
    downvotes:{
        type: Number,
        required: true,
    },

    comments: {
        type: [{
            type: String
        }],
        required: true,
    },
    blocked: {
        type: Boolean,
        required: true,
    },
});

const reportSchema = new Schema({
    reportedby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    offender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    concern: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    ignored: {
        type: Boolean,
        required: true,
    },
});


module.exports = { userSchema,  subGreddiitSchema, postSchema, reportSchema};