require("dotenv").config();
const { nanoid } = require("nanoid");
const knex = require("../knex");

class SessionController {
  findUserByUsername = async (username) => {
    return await knex("users")
      .select()
      .where({ username })
      .limit(1)
      .then((results) => results[0]);
  };

  findUserBySessionId = async (sessionId) => {
    const session = await knex("sessions")
      .select("user_id")
      .where({ session_id: sessionId })
      .limit(1)
      .then((results) => results[0]);

    if (!session) {
      return;
    }

    return knex("users")
      .select()
      .where({ id: session.user_id })
      .limit(1)
      .then((results) => results[0]);
  };

  deleteSession = async (sessionId) => {
    await knex("sessions").where({ session_id: sessionId }).delete();
  };

  createSession = async (userId) => {
    const sessionId = nanoid();
    await knex("sessions").insert({
      user_id: userId,
      session_id: sessionId,
    });
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
