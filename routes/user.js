const express = require("express");

const router = express.Router();

const UserControllers = require('../controllers/user');


router.post("/signup", UserControllers.createUser );

router.post("/login", UserControllers.userLogin);

module.exports = router;
