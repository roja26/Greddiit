var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const { userSchema } = require('./schema')
const { subGreddiitSchema } = require('./schema')
const { postSchema } = require('./schema')
const {reportSchema} = require('./schema')
const cors = require('cors')
require("dotenv").config();
const jwt = require("jsonwebtoken");


var indexRouter = require('./routes/index');
let userRouter = require('./routes/user');
let subGreddiitRouter = require('./routes/subGreddiit');
let postRouter = require('./routes/post');
let reportRouter = require('./routes/report');
const { JsonWebTokenError } = require('jsonwebtoken');

var app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://greddiit:greddiit@cluster0.occ0vgi.mongodb.net/greddiit?retryWrites=true&w=majority')

const userModel = mongoose.model("User", userSchema)
const subGreddiitModel = mongoose.model("SubGreddiit", subGreddiitSchema)
const postModel = mongoose.model("Post", postSchema)
const reportModel = mongoose.model("Report", reportSchema)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use(validateToken);

app.use('/api/user', userRouter(userModel));
app.use('/api/subGreddiit', subGreddiitRouter(postModel, subGreddiitModel, userModel));
app.use('/api/post', postRouter(postModel, subGreddiitModel, userModel));
app.use('/api/report', reportRouter(reportModel, postModel, subGreddiitModel,userModel));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

function validateToken(req, res, next){
  if(req.path == "/api/user/createUser" || req.path == "/api/user/login" || req.path == "/"){
    return next();
  }
  const auth = req.headers.authorization;
  if(!auth) {
    return res.status(201).send("Bad token");
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if(err){
      return res.status(201).send("Bad token");
    }
  });
  next();
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
