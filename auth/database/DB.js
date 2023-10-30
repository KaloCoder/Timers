const { nanoid } = require("nanoid");
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

module.exports = DB;
