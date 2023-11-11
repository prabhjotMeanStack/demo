const users = require("../models/users");

async function checkUserLoggedIn(req, res, next) {
  const {
    headers: { token },
  } = req;
  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  const userDetails = await users.findOne({ token });
  if (userDetails?.username) {
    req.user = userDetails;
    return next();
  }
  return res.status(401).json({ message: "Invalid Token" });
}

exports.checkUserLoggedIn = checkUserLoggedIn;
