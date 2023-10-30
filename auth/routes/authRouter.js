const express = require("express");
const router = new express.Router();
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const HashController = require("../controllers/HashController");
const DB = require("../database/DB");

router.use((req, res, next) => {
  const token = req.cookies.token;
  if (token && DB.sessions[token]) {
    req.user = DB.users.find((u) => u._id === DB.sessions[token].userId);
  }
  next();
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = DB.users.find((u) => u.username === username && u.password === HashController.hash(password));

  if (user) {
    const token = jwt.sign({ userId: user._id }, "secretKey");
    const session = {
      userId: user._id,
      token: token,
      timers: [],
    };
    DB.sessions[token] = session;
    res.cookie("token", token, { httpOnly: true }).redirect("/");
  } else {
    return res.redirect("/?authError=true");
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const checkUniqUsername = DB.users.some((u) => u.username === username);

  if (checkUniqUsername) {
    return res.redirect("/?authError=User is already exist!");
  } else {
    const newUser = {
      _id: nanoid(),
      username: username,
      password: HashController.hash(password),
    };
    const token = jwt.sign({ userId: newUser._id }, "secretKey");
    const session = {
      userId: newUser._id,
      token: token,
      timers: [],
    };
    DB.users.push(newUser);
    DB.sessions[token] = session;
    res.cookie("token", token, { httpOnly: true }).redirect("/");
  }
});

router.get("/api/timers", async (req, res) => {
  const token = req.cookies.token;
  const session = DB.sessions[token];

  if (session) {
    const userId = session.userId;
    const userTimers = DB.timers.filter((t) => t.userId === userId);

    res.json(userTimers);
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.get("/logout", async (req, res) => {
  const token = req.cookies.token;
  if (token && DB.sessions[token]) {
    delete DB.sessions[token];
    res.clearCookie("token");
  }
  res.redirect("/");
});

module.exports = router;
