const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const timeController = require("../controllers/TimeController");
const DB = require("../database/DB");
const SessionController = require("../controllers/SessionController");

for (let i = 0; i < DB.timers.length; i++) {
  const el = DB.timers[i];
  if (el.isActive) {
    timeController.createTimerInterval(DB.timers[i]);
  }
}

router.get("/", async (req, res) => {
  const isActive = (await req.query.isActive) === "true";
  const timers = DB.timers.filter((t) => t.isActive === isActive);
  res.json(timers);
});

router.post("/", SessionController.auth(), async (req, res) => {
  const { description } = req.body;
  const newTimer = {
    user_id: DB.users._id,
    start: Date.now(),
    description: description,
    isActive: true,
    id: nanoid(),
    progress: 0,
  };

  timeController.createTimerInterval(newTimer);
  DB.timers.push(newTimer);
  res.json(newTimer);
});

router.post("/:id/stop", async (req, res) => {
  const { id } = req.params;
  const timer = DB.timers.find((timer) => timer.id === id);

  if (!timer) {
    res.status(404).json(`Неизвестный ID таймера: ${id}`);
  }

  timer.end = Date.now();
  timer.isActive = false;
  const { start, end } = timer;
  timer.duration = end - start;

  res.status(204).json(DB);
});

module.exports = router;
