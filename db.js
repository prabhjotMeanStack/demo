const mongoose = require("mongoose");

//* ***Database connection mongodb using mongoose */
mongoose.connect(`mongodb+srv://admin:Wpadmin123@clst.a4aur.mongodb.net/demo?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
console.log("in db file")
// mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => console.error("MongoDB connection error"));
db.once("open", () => {
  console.info("Database Connected");
});
