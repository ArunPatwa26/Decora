const express = require("express");
const router = express.Router();
const { createUser, loginUser, updateUser } = require("../Controller/UserController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);

module.exports = router;
