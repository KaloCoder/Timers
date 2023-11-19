const DB = require("../database/DB");
const { nanoid } = require("nanoid");

class SessionController {
  findUserBySessionId = async (sessionId) => {
    const userId = DB.sessions[sessionId];
    if (!userId) {
      return;
    }
    return DB.users.find((u) => u._id === userId);
  };

  deleteSession = async (sessionId) => {
    delete DB.sessions[sessionId];
  };

  createSession = async (userId) => {
    const sessionId = nanoid();
    DB.sessions[sessionId] = userId;
    DB.timers = [];
    return sessionId;
  };

  auth = () => async (req, res, next) => {
    if (!req.cookies["sessionId"]) {
      return next();
    }
    const user = await this.findUserBySessionId(req.cookies["sessionId"]);
    req.user = user;
    req.sessionId = req.cookies["sessionId"];
    next();
  };
}

module.exports = new SessionController();
