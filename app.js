const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/meanpracticedb';
mongoose.connect(connectionString,{ useNewUrlParser: true })
.then(()=>{
    console.log('COnnected To Database');
})
.catch((err)=>{
    console.log('error:',err)
})

const Post = require('./models/post');

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
        );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,PUT,OPTIONS"
        );
    next();
})
app.post('/api/post',(req,res,next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    console.log('body',post);
    post.save().then((createdPost)=>{
        res.status(201).json({
            message:'Post Added Successfully',
            postId: createdPost._id
        })
    });
    
})
app.get('/api/posts',(req,res,next)=>{
    Post.find().then(results=>{
        res.status(200).json(
            {
                message:'Posts fetched Successfully',
                posts: results
            }
        );
    }) 
})

app.delete('/api/posts/:id',(req,res,next)=>{
    Post.deleteOne({_id:req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message:"Post Deleted"
        })
    })
})

module.exports= app;