var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let subGreddiitModel;
let userModel;
let postModel;
const mongoose = require('mongoose');

router.get("/posts", (req, res) => {
    postModel.find({}, (err, posts) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(posts)
        }
    });
});

router.post("/createPost", async (req, res) => {
    const { text, postedby, postedin, upvotes, downvotes } = req.body;
    console.log(text, postedby, postedin, upvotes, downvotes)

    const post = new postModel({
        _id: new mongoose.Types.ObjectId(),
        text,
        postedby: new mongoose.Types.ObjectId(postedby),
        postedin: new mongoose.Types.ObjectId(postedin),
        upvotes: 0,
        downvotes: 0,
        comments: [],
        blocked: false

    });
    console.log(post);
    subGreddiitModel.findByIdAndUpdate(postedin, { $push: { posts: post._id } }, (err, subGreddiit) => {
        if (err)
            console.log(err)
        console.log(subGreddiit)
    });
    post.save((err, post) => {
        if (err) {
            console.log(err)
            res.status(201).send(err)
        } else {
            res.status(200).send(post)
        }
    });
});
router.get("/getPost/:id", (req, res) => {
    const id = req.params.id;
    // console.log(id)
    subGreddiitModel.findById(id).populate({
        path: 'posts',
        populate: [{
            path: 'postedby',
            model: 'User'
        }, {
            path: 'postedin',
            model: 'SubGreddiit'
        }
        
        ],
    }).exec((err, subGreddiit) => {
        if (err) {
            res.status(201).send(err)
        } else {
            console.log(subGreddiit)
            res.status(200).send(subGreddiit.posts)
        }
    });
});
// ufind the post and update the upvotes and downvotes
router.post("/upvote", (req, res) => {
    const { id } = req.body;
    // console.log(id, upvotes, downvotes)

    postModel.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, (err, post) => {
        if (err)
            console.log(err)
        console.log(post)
    });
});

router.post("/downvote", (req, res) => {
    const { id } = req.body;
    // console.log(id, upvotes, downvotes)
    postModel.findByIdAndUpdate(id, { $inc: { downvotes: 1 } }, (err, post) => {
        if (err)
            console.log(err)
        console.log(post)
    });
});

router.post("/addComment", (req, res) => { 
    const { id, comment } = req.body;
    postModel.findByIdAndUpdate(id, { $push: { comments: comment } }, (err, post) => {
        if (err)
            console.log(err)
        console.log(post)
    });
});


        


module.exports = (_postModel, _subGreddiitModel, _userModel) => {
    subGreddiitModel = _subGreddiitModel;
    userModel = _userModel;
    postModel = _postModel;
    return router;
};