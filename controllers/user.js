const express = require("express");

const md5 = require("md5");

const users = require("../models/users");

const router = express.Router();

function genrateCodeAlphaNumeric(numberOfDigits) {
  let text = "";
  const possible = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";

  for (let i = 0; i < numberOfDigits; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return md5(text);
}

router.post("/token", async (req, res) => {
  try {
    const {
      body: { username, password },
    } = req;
    const userDetails = await users.findOne({ username, password });
    if (!userDetails) {
      return res.status(500).json({ message: "Username/Password did not match, please try again." });
    }
    const token = genrateCodeAlphaNumeric(16);
    // await users.create({username,password:md5(password)})
    await users.updateOne({ _id: userDetails._id }, { $set: { token } });
    return res.json({ message: "Token created successfully", token });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while saving token" });
  }
});

module.exports = router;
