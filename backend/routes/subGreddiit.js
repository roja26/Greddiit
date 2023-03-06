var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
let subGreddiitModel;
let userModel;
let postModel;
const mongoose = require('mongoose');

router.get("/subGreddiits", (req, res) => {
    subGreddiitModel.find({}, (err, subGreddiits) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(subGreddiits)
        }
    });
});
router.post("/createsubGreddiit", async (req, res) => {
    const { name, description, tags, banned, id } = req.body;
    const existingName = await subGreddiitModel.findOne({ name: name });
    if (existingName) {
        return res
            .status(400)
            .json({ msg: "Name already exists" });
    }
    const subGreddiit = new subGreddiitModel({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        tags,
        banned,
        people: [id],
        left: [],
        requests: [],
        posts: [],
        reports: []
    });
    userModel.findByIdAndUpdate(id, { $push: { subGreddiits: subGreddiit._id } }, (err, user) => {
        if (err)
            console.log(err)
        console.log(user)
    });
    subGreddiit.save((err, subGreddiit) => {
        if (err) {
            console.log(err)
            res.status(201).send(err)
        } else {
            res.status(200).send(subGreddiit)
        }
    });
});

router.post("/deletesubGreddiit", (req, res) => {
    const {id, subId} = req.body;
    userModel.findByIdAndUpdate(id, { $pull: { subGreddiits: subId } }, (err, user) => {
        if (err)
            console.log(err)
        else{
            postModel.deleteMany({postedin: subId}, (err, post) => {
                if(err)
                    console.log(err)
                else{
                    subGreddiitModel.findByIdAndDelete(subId, (err, subGreddiit) => {
                        if(err)
                            console.log(err)
                        else{
                            res.status(200).send("Deleted");
                        }
                    });
                }
            
            });
        }
    });
});
router.get("/getsubGreddiit/:id", (req, res) => {
    const id = req.params.id;
    userModel.findById(id).populate('subGreddiits').exec((err, user) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(user.subGreddiits)
        }
    });
});

router.get("/displaySub/:id", (req, res) => {
    subGreddiitModel.findById(req.params.id, (err, subGreddiit) => {
        if (err) {
            res.status(201).send(err)
        } 
        else {
            res.status(200).send(subGreddiit)
        }
    })
});
router.post("/joinSub", (req, res) => {
    const {id, subId} = req.body; 
    subGreddiitModel.findById(subId, (err, subGreddiit) => {
        if (err)
            res.status(201).send(err)
        else if(subGreddiit.left.includes(id)){
            return res.status(201).send("Already left");
        }
        else if(subGreddiit.requests.includes(id)){
            return res.status(201).send("Already requested");
        }
        else{
            subGreddiitModel.findByIdAndUpdate(subId, { $push: { requests: id } }, (err, subGreddiit) => {
                if (err)
                    return res.status(201).send(err)
                else{
                    res.status(200).send(subGreddiit)
                }
            });
        }
    
    });
    
});
router.post("/leaveSub", (req, res) => {
    const {id, subId} = req.body; 
    subGreddiitModel.findByIdAndUpdate(subId, { $pull: { people: id }, $push: {left: id} }, (err, user) => {
        if (err)
            res.status(201).send(err)
        else{
            res.status(200).send(user)
        }
    });
});
router.get("/getRequests/:id", (req, res) => {
    subGreddiitModel.findById(req.params.id).populate("requests").exec((err, subGreddiit) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(subGreddiit.requests)
        }
    })
});
router.get("/getJoined/:id", (req, res) => {
    subGreddiitModel.findById(req.params.id).populate("people").exec((err, subGreddiit) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(subGreddiit.people)
        }
    })
});
router.post("/acceptRequest", (req, res) => {
    const {id, subId} = req.body; 
    subGreddiitModel.findByIdAndUpdate(subId, { $push: { people: id }, $pull: {requests: id} }, (err, user) => {
        if (err)
            res.status(201).send(err)
        else{
            res.status(200).send(user)
        }
    });
});
router.post("/rejectRequest", (req, res) => {
    const {id, subId} = req.body; 
    subGreddiitModel.findByIdAndUpdate(subId, { $pull: {requests: id} }, (err, user) => {
        if (err)
            res.status(201).send(err)
        else{
            res.status(200).send(user)
        }
    });
});
module.exports = (_postModel, _subGreddiitModel, _userModel) => {
    postModel = _postModel;
    subGreddiitModel = _subGreddiitModel;
    userModel = _userModel;
    return router;
};