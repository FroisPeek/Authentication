const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConifg = require("../config/auth.json");

const User = require("../models/user");

const router = express.Router();

// função de criação do token
function generateToken(params = {}) {
  return jwt.sign({ params }, authConifg.secret, {
    expiresIn: 18000,
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "user already exists" });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ error: "User not found!" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid password" });
  }

  user.password = undefined; // evita o retorno da senha
  res.send({ user, token: generateToken({ id: user.id }) });
});

module.exports = (app) => app.use("/auth", router);
