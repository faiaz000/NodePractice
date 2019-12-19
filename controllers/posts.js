const Post = require("./../models/post");

exports.createPost =  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/assets/images/" + req.file.filename,
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
      })
      .catch(error => {
        res.status(500).json({
          message: "Post creation failed!!!!"
        });
      });
    }

  exports.getPosts = (req, res, next) => {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        let fetchedPosts = [];
        postQuery = Post.find();
        if (pageSize && currentPage) {
          postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        postQuery
          .then(results => {
            fetchedPosts = results;
            return Post.count();
          })
          .then(count => {
            res.status(200).json({
              message: "Posts fetched Successfully!",
              posts: fetchedPosts,
              maxPosts: count
            });
          }).catch( error => {
            res.status(500).json({
              message: "Fetching posts failed!"
            })
          });
      }

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post Not Found"
        });
      }
    }).catch(error=>{
      res.status(500).json({
        message: "Fetching post failed!!!"
      });
    });
  }
  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        if (result.n> 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not Authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't update  selected post!"
        });
      });
  }
exports.deletePost =  (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Delete successful!" });
        } else {
          res.status(401).json({ message: "You are Not Authorized!" });
        }
      }
    ).catch(error=>{
      res.status(500).json({
        message: "Fetching post failed!!!"
      });
    });
  }
