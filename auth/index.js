const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");

const logger = require("./middleware/logger");
const timeRouter = require("./routes/timeRouter");
const authRouter = require("./routes/authRouter");
const SessionController = require("./controllers/SessionController");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/timers", timeRouter);
app.use(authRouter);

app.get("/", SessionController.auth(), async (req, res) => {
  res.render("index", {
    user: await req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
