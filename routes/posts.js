const express = require("express");
const router = express.Router();
const PostsController = require('../controllers/posts');
const extractImgFile = require('../middleware/check-mime')
const checkAuth = require("../middleware/cheeck-auth");


router.post(
  "",
  checkAuth,extractImgFile
  ,PostsController.createPost
);
router.get("", PostsController.getPosts);
router.get("/:id", PostsController.getPost);
router.put(
  "/:id",
  checkAuth,
  extractImgFile,
  PostsController.updatePost
);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
