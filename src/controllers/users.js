const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const users = await User.find();
  return res.send({ users });
});

module.exports = (app) => app.use("/", router);
