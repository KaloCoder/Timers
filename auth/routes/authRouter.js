const express = require("express");
const router = new express.Router();

const HashController = require("../controllers/HashController");
const DB = require("../database/DB");
const bodyParser = require("body-parser");
const SessionController = require("../controllers/SessionController");
const { nanoid } = require("nanoid");

router.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = DB.users.find((u) => u.username === username && u.password === HashController.hash(password));

  if (!user || user.password !== HashController.hash(password)) {
    return res.redirect("/?authError=true");
  }
  const sessionId = await SessionController.createSession(user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  const checkUniqueName = DB.users.some((u) => u.username === username);

  if (checkUniqueName) {
    return await res.redirect("/?authError=This user is already exists");
  } else {
    const newUser = {
      _id: nanoid(),
      username: username,
      password: HashController.hash(password),
    };
    const sessionId = await SessionController.createSession(newUser._id);
    DB.users.push(newUser);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  }
});

router.get("/logout", SessionController.auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  await SessionController.deleteSession(req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});

// router.get("/")

module.exports = router;
