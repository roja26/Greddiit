var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
let userModel;
const mongoose = require('mongoose');

router.get("/users", (req, res) => {
    userModel.find({}, (err, users) => {
        if (err) {
            res.status(201).send(err)
        } else {
            res.status(200).send(users)
        }
    });
});

// createUser route
router.post("/createUser", async (req, res) => {
    const { username, email, password, firstname, lastname, age, contact } = req.body;
    const existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
        return res
            .status(400)
            .json({ msg: "An account with this email already exists" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new userModel({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: passwordHash,
        firstname,
        lastname,
        age,
        contact,
        followers: [],
        following: [],
        subGreddiits: [],
        saved: []
    });
    user.save((err, user) => {
        if (err) {
            console.log(err)
            res.status(201).send(err)
        } else {
            res.status(200).send(user)
        }
    });
});
// login route setup
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validate

        if (!username || !password) {
            return res.status(201).json({ msg: "Not all fields have been entered" });
        }

        // checking email that was entered and comparing email in our database
        const user = await userModel.findOne({ username: username });
        if (!user) {
            return res
                .status(201)
                .json({ msg: "Invalid credentails" });
        }

        // Checking password entered and comparing with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(201).json({ msg: "Invalid credentials" });
        }

        // Creating our json web token by passing the user id and our JWT_SECRET
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).send({
            token,
            id: user._id,
        });
    } catch (error) {
        res.status(201).send(error.message);
    }
});

// delete user account route
router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// validating if user is logged in by boolean check most useful for front-end
router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await userModel.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

router.get("/getUser/:id", (req, res) => {
    const id = req.params.id;
    userModel.findById(id).populate("followers").populate("following").populate({
        path: 'saved',
        populate: [{
            path: 'postedby',
            model: 'User'
        }, {
            path: 'postedin',
            model: 'SubGreddiit'
        }
        
        ],
    }).exec((err, users) => {
        if (err) {
            res.status(201).send(err)
        } else {
            
            res.status(200).send(users)
        }
    })
});

router.post("/updateUser", (req, res) => {
    const id = req.body.id;
    if (id == null) return res.status(201).send("No id provided");
  
    userModel.findByIdAndUpdate(id, req.body, (err, users) => {
      if (err) {
        res.status(201).send("Database error");
      }
      if (!users) {
        res.status(201).send("No user with given email found");
      }
      res.status(200).send("Successfully updated");
    });
  });

// add user to followers list
router.post("/addFollower", (req, res) => {
    const id = req.body.id;
    const followerId = req.body.followerId;
    console.log(id, followerId);
    if (id == null) return res.status(201).send("No id provided");
    if (followerId == null) return res.status(201).send("No followerId provided");
    if(id == followerId) return res.status(201).send("Cannot follow yourself");

    userModel.findById(id, (err, users) => {
        if (err) {
            res.status(201).send(err)
        } else {
            if(users.followers.includes(followerId)){
                return res.status(201).send("Already following");
            }else{
                userModel.findByIdAndUpdate(id, { $push: { followers: followerId } }, (err, users) => {
                    if (err) {
                        return res.status(201).send("Database error");
                    }
                    else if (!users) {
                        return res.status(201).send("No user with given email found");
                    }
                    else{
                        userModel.findByIdAndUpdate(followerId, { $push: { following: id} }, (err, users) => {
                            if (err) {
                               return res.status(201).send("Database error");
                            }
                            else{
                                res.status(200).send("Successfully updated");
                            }
                        });
                    }
                });
            }
        }
    })
});

router.post("/removeFollower", (req, res) => {
    const me_id = req.body.me_id;
    const personId = req.body.personId;
    console.log(me_id, personId);
    if (me_id == null) return res.status(201).send("No id provided");
    if (personId == null) return res.status(201).send("No Id provided");
    userModel.findByIdAndUpdate(me_id, { $pull: { followers: personId } }, (err, users) => {
        if (err) {
            res.status(201).send("Database error");
        }
        if (!users) {
            res.status(201).send("No user with given email found");
        }else{
            userModel.findByIdAndUpdate(personId, { $pull: { following: me_id} }, (err, users) => {
                if (err) {
                    res.status(201).send("Database error");
                }
                if (!users) {
                    res.status(201).send("No user with given email found");
                }else{
                    res.status(200).send("Successfully updated");
                }
            });
        }
    });
});

router.post("/removeFollowing", (req, res) => {
    const me_id = req.body.me_id;
    const personId = req.body.personId;
    console.log(me_id, personId);
    if (me_id == null) return res.status(201).send("No id provided");
    if (personId == null) return res.status(201).send("No Id provided");
    userModel.findByIdAndUpdate(me_id, { $pull: { following: personId } }, (err, users) => {
        if (err) {
            res.status(201).send("Database error");
        }
        if (!users) {
            res.status(201).send("No user with given email found");
        }else{
            userModel.findByIdAndUpdate(personId, { $pull: { followers: me_id} }, (err, users) => {
                if (err) {
                    res.status(201).send("Database error");
                }
                if (!users) {
                    res.status(201).send("No user with given email found");
                }else{
                    res.status(200).send("Successfully updated");
                }
            });
        }
    });
});

router.post("/savePost", (req, res) => {
    const id = req.body.id;
    const postId = req.body.postId;
    console.log(id, postId);
    if (id == null) return res.status(201).send("No id provided");
    if (postId == null) return res.status(201).send("No postId provided");
    userModel.findByIdAndUpdate(id, { $push: { saved: postId } }, (err, users) => {
        if (err) {
            res.status(201).send("Database error");
        }
        if (!users) {
            res.status(201).send("No user with given email found");
        }else{
            res.status(200).send("Successfully updated");
        }
    });
});
router.post("/removeSavePost", (req, res) => {
    const id = req.body.id;
    const postId = req.body.postId;
    console.log(id, postId);
    if (id == null) return res.status(201).send("No id provided");
    if (postId == null) return res.status(201).send("No postId provided");
    userModel.findByIdAndUpdate(id, { $pull: { saved: postId } }, (err, users) => {
        if (err) {
            res.status(201).send("Database error");
        }
        if (!users) {
            res.status(201).send("No user with given email found");
        }else{
            res.status(200).send("Successfully updated");
        }
    });
});



module.exports = (_userModel) => {
    userModel = _userModel;
    return router;
};