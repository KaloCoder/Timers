const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const timeController = require("../controllers/TimeController");

const TIMERS = [
  {
    start: Date.now(),
    description: "Timer 1",
    isActive: true,
    id: nanoid(),
    progress: 0,
  },
  {
    start: Date.now() - 5000,
    end: Date.now() - 3000,
    duration: 2000,
    description: "Timer 0",
    isActive: false,
    id: nanoid(),
  },
];


for (let i = 0; i < TIMERS.length; i++) {
  const el = TIMERS[i];
  if (el.isActive) {
    timeController.createTimerInterval((TIMERS[i]));
  }
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/api/timers", async (req, res) => {
  const isActive = req.query.isActive === "true";
  const timers = TIMERS.filter((t) => t.isActive === isActive);

  await res.json(timers);
});

router.post("/api/timers/", async (req, res) => {
  const { description } = req.body;

  const newTimer = {
    start: Date.now(),
    description: description,
    isActive: true,
    id: nanoid(),
    progress: 0,
  };

  timeController.createTimerInterval(newTimer);
  TIMERS.push(newTimer);
  await res.json(newTimer);
});

router.post("/api/timers/:id/stop", async (req, res) => {
  const { id } = req.params;
  const timer = TIMERS.find((timer) => timer.id === id);

  if (!timer) {
    res.status(404).json(`Неизвестный ID таймера: ${id}`);
  }

  timer.end = Date.now();
  timer.isActive = false;
  const { start, end } = timer;
  timer.duration = end - start;

  await res.status(204).json(TIMERS);
});

module.exports = router;
