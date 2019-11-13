const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require("body-parser");

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/meanpracticedb";
mongoose
  .connect(connectionString, { useNewUrlParser: true,useUnifiedTopology: true })
  .then(() => {
    console.log("Connected To Database");
  })
  .catch(err => {
    console.log("error:", err);
  });

const Post = require("./models/post");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:false
}));
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/images', express.static(path.join(__dirname, './assets/images')));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  
  next();
});
app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
