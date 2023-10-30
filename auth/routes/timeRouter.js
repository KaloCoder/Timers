const express = require("express");

const { nanoid } = require("nanoid");
const timeController = require("../controllers/TimeController");
const HashController = require("../controllers/HashController");

const DB = {
  users: [
    {
      _id: nanoid(),
      username: "admin",
      password: HashController.hash("pwd007"),
    },
  ],
  sessions: {},
  timers: [],
};
const router = express.Router();

for (let i = 0; i < DB.timers.length; i++) {
  const el = DB.timers[i];
  if (el.isActive) {
    timeController.createTimerInterval(DB.timers[i]);
  }
}

router.get("/", (req, res) => {
  const isActive = req.query.isActive === "true";
  const timers = DB.timers.filter((t) => t.isActive === isActive);
  res.json(timers);
});

router.post("/", async (req, res) => {
  const { description } = req.body;
  console.log(123);
  const newTimer = {
    start: Date.now(),
    description: description,
    isActive: true,
    id: nanoid(),
    progress: 0,
  };

  timeController.createTimerInterval(newTimer);
  DB.timers.push(newTimer);
  await res.json(newTimer);
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

  await res.status(204).json(DB);
});

module.exports = router;
