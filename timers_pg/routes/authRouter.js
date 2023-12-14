require("dotenv").config();

const express = require("express");
const router = new express.Router();

const bodyParser = require("body-parser");
const SessionController = require("../controllers/SessionController");
const bcrypt = require("bcrypt");
const knex = require("../knex");

router.post(
  "/login",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await knex
        .select()
        .table("users")
        .where({
          username: username,
        })
        .then((u) => u[0]);

      if (!user) {
        return res.redirect("/?authError=true");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.redirect("/?authError=true");
      }
      const sessionId = await SessionController.createSession(user.id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

// router.post(
//   "/signup",
//   bodyParser.urlencoded({ extended: false }),
//   async (req, res) => {
//     const { username, password } = req.body;
//     const checkName = await knex("users").where({ username: username }).first();

//     if (checkName) {
//       return await res.redirect("/?authError=This user is already exists");
//     } else {
//       const newUser = {
//         username: username,
//         password: HashController.hash(password),
//       };
//       const userId = await knex("users").insert(newUser);
//       const sessionId = await SessionController.createSession(userId[0]);
//       res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
//     }
//   }
// );
router.post(
  "/signup",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // хэширование пароля
      const newUser = { username, password: hashedPassword };

      const user = await knex("users")
        .insert(newUser).returning("*")
        .where({ username })
        .limit(1)
        .then((u) => u[0]);

      const sessionId = await SessionController.createSession(user.id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

router.get("/logout", SessionController.auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  await SessionController.deleteSession(req.cookies["sessionId"]);
  res.clearCookie("sessionId").redirect("/");
});

module.exports = router;
