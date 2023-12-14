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
    return sessionId;
  };

  auth = () => async (req, res, next) => {
    let sessionId = req.cookies["sessionId"];
    if (!sessionId) {
      if (req.method === "POST") {
        return res.sendStatus(401);
      }
      return next();
    }
    const user = await this.findUserBySessionId(sessionId);

    req.user = user;
    req.sessionId = sessionId;

    next();
  };
}

module.exports = new SessionController();
