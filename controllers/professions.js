const express = require("express");

const profession = require("../models/professions");

const { checkUserLoggedIn } = require("./auth");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const professions = await profession.find({ status: "Active" }, { professionName: 1, description: 1, prompt: 1 });
    return res.json({ message: "Professions Fetched", professions });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching professions" });
  }
});

router.put("/:professionId", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      params: { professionId },
      body: { professionName, description, prompt },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    if (!professionName?.trim()) {
      return res.status(500).json({ message: "Please provide a valid profession name" });
    }
    if (!description?.trim()) {
      return res.status(500).json({ message: "Please provide a valid profession description" });
    }
    if (!prompt?.trim() || !prompt.includes('chatgpt_category_name') || !prompt.includes('chatgpt_skill_set')) {
      return res.status(500).json({ message: "Please provide a valid prompt" });
    }
    const professionExists = await profession.exists({ _id: professionId, status: "Active" });
    if (!professionExists) {
      return res.status(500).json({ message: "The profession doesn't exists" });
    }
    await profession.updateOne({ _id: professionId }, { $set: { professionName, description, prompt } });
    return res.json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while updating professions" });
  }
});

router.delete("/:professionId", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      params: { professionId },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    await profession.updateOne({ _id: professionId }, { $set: { status: "Inactive" } });
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching professions" });
  }
});

router.post("/add", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      body: { professionName, description, prompt },
    } = req;
    if (!professionName?.trim()) {
      return res.status(500).json({ message: "Please provide a valid profession name" });
    }
    if (!description?.trim()) {
      return res.status(500).json({ message: "Please provide a valid profession description" });
    }
    if (!prompt?.trim() || !prompt.includes('chatgpt_category_name') || !prompt.includes('chatgpt_skill_set')) {
      return res.status(500).json({ message: "Please provide a valid prompt" });
    }
    const professionExists = await profession.exists({ professionName, status: "Active" });
    if (professionExists) {
      return res.status(500).json({ message: "The profession name already exists" });
    }
    await profession.create({ professionName, description, prompt });
    return res.json({ message: "Added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while insering professions" });
  }
});

module.exports = router;
