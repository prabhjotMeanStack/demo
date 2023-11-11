const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

require("./db");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.send({
      message: "The body of your request is not valid JSON.",
    });
  }
});

app.use(cors());
const professionRoutes = require("./controllers/professions");
const questionRoutes = require("./controllers/questions");
const userRoutes = require("./controllers/user");

app.use("/professions", professionRoutes);
app.use("/questions", questionRoutes);
app.use("/user", userRoutes);
app.use("/demo/professions", professionRoutes);
app.use("/demo/questions", questionRoutes);
app.use("/demo/user", userRoutes);

console.log(path.resolve(__dirname, 'build', 'index.html'))
app.get('*', (req, res) => {
  let allowedUrl = [
    "/asset-manifest.json",
    "asset-/demo/manifest.json",
    "/favicon.ico",
    "/demo/favicon.ico",
    "/index.html",
    "/demo/index.html",
    "/logo192.png",
    "/demo/logo192.png",
    "/logo512.png",
    "/demo/logo512.png",
    "/manifest.json",
    "/demo/manifest.json",
    "/robots.txt",
    "/demo/robots.txt"
  ]
  if(allowedUrl.includes(req.url)) {
    console.log(path.resolve(__dirname, 'build', req.path.replace('/','')))
    res.sendFile(path.resolve(__dirname, 'build', req.path.replace('/','')));
  } else if(req.url.includes("/static")) {
    console.log(path.resolve(__dirname, 'build', req.path.replace('/','')))
    res.sendFile(path.resolve(__dirname, 'build', req.path.replace('/','')));
  } else {
    console.log(path.resolve(__dirname, 'build', 'index.html'))
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  }
});

http.createServer(app).listen(4000, function () {
  console.log("Demo server listening on port 4000");
});

process.on("SIGINT", function () {
  process.exit(2);
});

process.on("beforeExit", function () {
  process.emit("cleanup");
});
// clean exit
process.on("exit", function () {
  console.log("\x1b[361m%s\x1b[0m", "===Demo SERVER RESTARTED===");
  process.emit("cleanup");
});

// catch uncaught exceptions, trace, then exit normally
process.on("uncaughtException", function (e) {
  console.error("Uncaught Exception...", e.stack);
  process.exit(1);
});
