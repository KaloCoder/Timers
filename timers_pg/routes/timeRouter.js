require("dotenv").config();

const express = require("express");
const router = express.Router();

const timeController = require("../controllers/TimeController");
const SessionController = require("../controllers/SessionController");
const knex = require("../knex");

router.get("/", SessionController.auth(), async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const isActive = req.query.isActive === "true";
  const timers = await knex("timers").where({
    user_id: userId,
    isActive,
  });
  res.json(timers);
});

router.post("/", SessionController.auth(), async (req, res) => {
  const { description } = req.body;

  const newTimer = {
    user_id: req.user.id,
    start: new Date().toISOString(),
    description: description,
    isActive: true,
    progress: 0,
    // end: null,
    // duration: null,
  };

  await knex("timers").insert(newTimer);
  timeController.createTimerInterval(newTimer);
  res.json(newTimer);
});

router.post("/:id/stop", async (req, res) => {
  const { id } = req.params;
  const timer = await knex("timers")
    .where({ id: id })
    .update({ end: new Date().toISOString(), isActive: false });

  if (!timer) {
    res.status(404).json(`Неизвестный ID таймера: ${id}`);
  }
  // timer[end] = new Date().toISOString();
  // timer[isActive] = false;
  // const { start, end } = timer;
  // timer[duration] = end - start;

  res.status(204).json(timer);
});

module.exports = router;
