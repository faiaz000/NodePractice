const express = require('express');
const Post = require('./../models/post');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/cheeck-auth');
const mimeTypeMap = {
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'jpg'
}

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid = mimeTypeMap[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if(isValid){
      error = null
    }
    cb(error,'./assets/images');
  },
  filename: (req,file,cb) => {
    const name = file.originalname
                 .toLowerCase().split(' ').join('-');
    const ext = mimeTypeMap[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
    
  }
});


router.post("",checkAuth,multer({storage:storage}).single('image') ,(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath:url + '/assets/images/'+ req.file.filename,
      creator: req.userData.userId
    });
  
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post Added Successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  });
  router.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    let fetchedPosts =[];
    postQuery = Post.find();
    if(pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage -1)).limit(pageSize);
    }
    postQuery
    .then((results)=>{
      fetchedPosts = results;
      return Post.count()
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched Successfully",
        posts: fetchedPosts,
        maxPosts:count
      });
    });
  });
  router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post Not Found"
        });
      }
    });
  });
  router.put(
    "/:id",checkAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
      let imagePath = req.body.imagePath;
      if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
      }
      const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
      });

      Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if(result.nModified>0){
          res.status(200).json({ message: "Update successful!" });
        }
        else{
          res.status(401).json({ message: "Not Authorized!" });
        }
      });
    }
  );
  
  router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId   }).then(result => {
      if(result.n>0){
        res.status(200).json({ message: "Update successful!" });
      }
      else{
        res.status(401).json({ message: "Not Authorized!" });
      }
    });
  });

  module.exports = router;