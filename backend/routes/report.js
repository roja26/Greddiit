var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let subGreddiitModel;
let userModel;
let postModel;
let reportModel;
const mongoose = require('mongoose');

router.get("/reports", (req, res) => {
    reportModel.find({}).populate("reportedby").populate("offender").exec((err, reports) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(reports)
        }
    });
});

router.post("/createReport", async (req, res) => {
    const { reportedby, offender, concern, post, subId} = req.body;

    const report = new reportModel({
        _id: new mongoose.Types.ObjectId(),
        reportedby : new mongoose.Types.ObjectId(reportedby),
        offender: new mongoose.Types.ObjectId(offender),
        concern,
        post: new mongoose.Types.ObjectId(post),
        ignored: false

    });
    subGreddiitModel.findByIdAndUpdate(subId, { $push: { reports: report._id } }, (err, subGreddiit) => {
        if (err)
            console.log(err)
        console.log(subGreddiit)
    });
    report.save((err, report) => {
        if (err) {
            console.log(err)
            res.status(201).send(err)
        } else {
            res.status(200).send(report)
        }
    });
});

router.get("/getReport/:id", (req, res) => {
    const id = req.params.id;
    subGreddiitModel.findById(id).populate({
        path: 'reports',
        populate: [{
            path: 'reportedby',
            model: 'User'
        }, {
            path: 'offender',
            model: 'User'
        },
        {
            path: 'post',
            model: 'Post'
        }
        
        ],
    }).exec((err, subGreddiit) => {
        if (err) {
            res.status(201).send(err)
        } else {
            console.log(subGreddiit)
            res.status(200).send(subGreddiit.reports)
        }
    });
});
router.post("/setIgnored", (req, res) => {
    const {id, ignored} = req.body;
    reportModel.findByIdAndUpdate(id, { ignored: ignored }, (err, report) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(report)
        }
    });
});

router.post("/deletePost", (req, res) => {
    const {id, postId, subId} = req.body;
    subGreddiitModel.findByIdAndUpdate(subId, { $pull: { "posts": postId, "reports": id } }, (err, subGreddiit) => {
        console.log(subGreddiit);
        if (err)
            console.log(err)
        else{
            reportModel.deleteMany({post: postId}, (err, report) => {
                if(err){
                    console.log(err);
                }
                else{
                    postModel.findByIdAndDelete(postId, (err, post) => { 
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.status(200).send("Deleted Post");
                        }
                    });
                }
            
            });
        }
    });
});
router.post("/blockPost", (req, res) => {
    const {id, postId, subId} = req.body;
    postModel.findByIdAndUpdate(postId, { blocked: true }, (err, post) => {
        if (err) {
            res.status(201).send(err)
        } else {
            subGreddiitModel.findByIdAndUpdate(subId, {$pull : {"reports": id}}, (err, subGreddiit) => {
                if(err){
                    console.log(err);
                }
                else{
                    reportModel.findByIdAndDelete(id, (err, report) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.status(200).send("Blocked Post");
                        }
                    });
                }
            });
        }
    });
});

router.get("/getBlocked/:id", (req, res) => {
    const id = req.params.id;
    postModel.find({"blocked": true, "postedin": id}).populate("postedby").exec((err, posts) => {
        if (err) {
            res.status(201).send(err)
        } else {
            console.log(posts.postedby)
            res.status(200).send(posts)
        }
    });
});


module.exports = (_reportModel,_postModel, _subGreddiitModel, _userModel) => {
    subGreddiitModel = _subGreddiitModel;
    userModel = _userModel;
    postModel = _postModel;
    reportModel = _reportModel;
    return router;
};