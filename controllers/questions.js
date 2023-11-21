const express = require("express");

const multipart = require("express-fileupload");

const questions = require("../models/questions");
const answerModel = require("../models/answers");

const { checkUserLoggedIn } = require("./auth");

const multipartMiddleware = multipart();
const csvtojson = require("csvtojson");

const professions = require("../models/professions");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const router = express.Router();

router.use("/upload", multipartMiddleware);

router.get("/all", async (req, res) => {
  try {
    const {
      query: { professionId },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    const professionData = await professions.find({ _id: professionId, status: "Active" });
    if (!professionData) {
      return res.status(500).json({ message: "Invalid profession" });
    }
    const allQuestions = await questions.find({ professionId, status: "Active" });
    return res.json({ message: "Questions Fetched", questions: allQuestions, profession: professionData[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching questions" });
  }
});

router.get("/all-categories-skills", async (req, res) => {
  try {
    const {
      query: { professionId },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    let allCategories = [];
    let allSkills = [];
    const allQuestions = await questions.find({ professionId, status: "Active" }, { categories: 1, skills: 1 });
    for (const question of allQuestions) {
      allCategories = [...allCategories, ...question.categories];
      allSkills = [...allSkills, ...question.skills];
    }
    return res.json({
      message: "Data Fetched",
      allCategories: Array.from(new Set(allCategories)),
      allSkills: Array.from(new Set(allSkills)),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching questions" });
  }
});

router.put("/:questionId", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      params: { questionId },
      body: { question, description, categories, skills },
    } = req;
    if (!questionId) {
      return res.status(500).json({ message: "Please provide the question Id" });
    }
    if (!question?.trim()) {
      return res.status(500).json({ message: "Please provide a valid question name" });
    }
    if (!description?.trim()) {
      return res.status(500).json({ message: "Please provide a valid question description" });
    }
    if (!categories || !categories.length) {
      return res.status(500).json({ message: "Please provide valid categories" });
    }
    if (!skills || !skills.length) {
      return res.status(500).json({ message: "Please provide valid skills" });
    }
    const questionExists = await questions.exists({ _id: questionId, status: "Active" });
    if (!questionExists) {
      return res.status(500).json({ message: "The question doesn't exists" });
    }
    await questions.updateOne({ _id: questionId }, { $set: { question, description, categories, skills } });
    return res.json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while updating questions" });
  }
});

router.delete("/:questionId", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      params: { questionId },
    } = req;
    if (!questionId) {
      return res.status(500).json({ message: "Please provide the question Id" });
    }
    await questions.updateOne({ _id: questionId }, { $set: { status: "Inactive" } });
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching questions" });
  }
});

router.post("/add", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      body: { question, answerOptions, description, categories, skills, professionId },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    if (!question?.trim()) {
      return res.status(500).json({ message: "Please provide a valid question name" });
    }
    if (!answerOptions?.length) {
      return res.status(500).json({ message: "Please provide valid answer options" });
    }
    if (answerOptions.length != 5) {
      return res.status(500).json({ message: "Please provide 5 answer options" });
    }
    if (!description?.trim()) {
      return res.status(500).json({ message: "Please provide a valid question description" });
    }
    if (!categories || !categories.length) {
      return res.status(500).json({ message: "Please provide a valid categories" });
    }
    if (!skills || !skills.length) {
      return res.status(500).json({ message: "Please provide a valid skills" });
    }
    // const array = [
    //   {
    //     question:"Question 1",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"category1",
    //     skill:"skill1",
    //     professionId:"654645a10948f369b4c9efcc"
    //   },
    //   {
    //     question:"Question 2",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"category1",
    //     skill:"skill1",
    //     professionId:"654645a10948f369b4c9efcc"
    //   },
    //   {
    //     question:"Question 3",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"category1",
    //     skill:"skill1",
    //     professionId:"654645a10948f369b4c9efcc"
    //   },
    //   {
    //     question:"Question 4",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"category1",
    //     skill:"skill1",
    //     professionId:"654645a10948f369b4c9efcc"
    //   },
    //   {
    //     question:"Question 5",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"category1",
    //     skill:"skill1",
    //     professionId:"654645a10948f369b4c9efcc"
    //   },
    //   {
    //     question:"Question 1",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"google",
    //     skill:"researchSkil",
    //     professionId:"654645b20948f369b4c9efcd"
    //   },
    //   {
    //     question:"Question 2",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"google",
    //     skill:"researchSkil",
    //     professionId:"654645b20948f369b4c9efcd"
    //   },
    //   {
    //     question:"Question 3",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"google",
    //     skill:"researchSkil",
    //     professionId:"654645b20948f369b4c9efcd"
    //   },
    //   {
    //     question:"Question 4",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"google",
    //     skill:"researchSkil",
    //     professionId:"654645b20948f369b4c9efcd"
    //   },
    //   {
    //     question:"Question 5",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"google",
    //     skill:"researchSkil",
    //     professionId:"654645b20948f369b4c9efcd"
    //   },
    //   {
    //     question:"Question 1",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Figma",
    //     skill:"uiSkill",
    //     professionId:"654645c50948f369b4c9efce"
    //   },
    //   {
    //     question:"Question 2",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Figma",
    //     skill:"uiSkill",
    //     professionId:"654645c50948f369b4c9efce"
    //   },
    //   {
    //     question:"Question 3",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Figma",
    //     skill:"uiSkill",
    //     professionId:"654645c50948f369b4c9efce"
    //   },
    //   {
    //     question:"Question 4",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Figma",
    //     skill:"uiSkill",
    //     professionId:"654645c50948f369b4c9efce"
    //   },
    //   {
    //     question:"Question 5",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Figma",
    //     skill:"uiSkill",
    //     professionId:"654645c50948f369b4c9efce"
    //   },
    //   {
    //     question:"Question 1",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Jira",
    //     skill:"team management",
    //     professionId:"654645d50948f369b4c9efcf"
    //   },
    //   {
    //     question:"Question 2",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Jira",
    //     skill:"team management",
    //     professionId:"654645d50948f369b4c9efcf"
    //   },
    //   {
    //     question:"Question 3",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Jira",
    //     skill:"team management",
    //     professionId:"654645d50948f369b4c9efcf"
    //   },
    //   {
    //     question:"Question 4",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Jira",
    //     skill:"team management",
    //     professionId:"654645d50948f369b4c9efcf"
    //   },
    //   {
    //     question:"Question 5",
    //     answerOptions:["option 1","option 2","option 3","option 4", "option 5"],
    //     description: "Slecect a option matching your skill",
    //     category:"Jira",
    //     skill:"team management",
    //     professionId:"654645d50948f369b4c9efcf"
    //   }
    // ]
    // questions.insertMany(array)
    await questions.create({ question, answerOptions, description, categories, skills, professionId });
    return res.json({ message: "Added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while updating questions" });
  }
});

router.post("/upload", checkUserLoggedIn, async (req, res) => {
  try {
    const {
      body: { professionId },
      files,
    } = req;
    const professionsExists = await professions.exists({ _id: professionId, status: "Active" });
    if (!professionsExists) {
      return res.status(500).json({ message: "Invalid profession" });
    }

    const csvData = files.file.data.toString("utf8");
    const jsonArray = await csvtojson().fromString(csvData);
    const questionArray = jsonArray.map((item) => {
      return {
        question: item.Question,
        answerOptions: [item["Answer 1"], item["Answer 2"], item["Answer 3"], item["Answer 4"], item["Answer 5"]],
        description: item.Description,
        categories: item.Categories.split(","),
        skills: item.Skills.split(","),
        professionId,
      };
    });
    await questions.updateMany({}, { professionId, status: "Inactive" });
    await questions.insertMany(questionArray);
    return res.json({ message: "Questions uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while fetching questions" });
  }
});

router.post("/answer", async (req, res) => {
  try {
    //  answers:{
    //   questionId: selectedOption range from 1-5
    //  }
    const {
      body: { professionId, answers },
    } = req;
    if (!professionId) {
      return res.status(500).json({ message: "Please provide the profession Id" });
    }
    const professionData = await professions.find({ _id: professionId, status: "Active" });
    if (!professionData) {
      return res.status(500).json({ message: "Invalid profession" });
    }
    const allQuestions = await questions.find({ professionId, status: "Active" }).lean();
    if (!answers || allQuestions.length > Object.keys(answers).length) {
      return res.status(500).json({ message: "Please answer all the questions" });
    }
    const answerArray = [];
    let answerId = new ObjectId();
    for (const question of allQuestions) {
      answerArray.push({
        answerId,
        question: question.question,
        questionId: question._id,
        answerOptions: question.answerOptions,
        selectedAnswer: question.answerOptions[Number(answers[question._id]) - 1],
        description: question.description,
        categories: question.categories,
        skills: question.skills,
        professionId: question.professionId,
        ip: req.ip,
      });
    }
    await answerModel.insertMany(answerArray);
    return res.json({ message: "Added successfully", answerId });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while updating questions" });
  }
});

router.get("/answer", async (req, res) => {
  try {
    const {
      query: { answerId },
    } = req;
    if (!answerId || !ObjectId.isValid(answerId)) {
      return res.status(500).json({ message: "Please provide the valid answer Id" });
    }
    const answerData = await answerModel.find({ answerId }).lean();
    if (!answerData) {
      return res.status(500).json({ message: "Invalid answers" });
    }
    const professionData = await professions.find({ _id: answerData[0].professionId });
    if (!professionData) {
      return res.status(500).json({ message: "Invalid profession" });
    }
    const professionWiseData = {};
    professionWiseData.Overview = {};
    for (const question of answerData) {
      for (const category of question.categories) {
        if (!professionWiseData[category]) {
          professionWiseData[category] = {};
        }
        if (!professionWiseData.Overview[category]) {
          professionWiseData.Overview[category] = {
            marksAssigned: 0,
            numberOfQuestions: 0,
          };
        }
        for (const skill of question.skills) {
          if (!professionWiseData[category][skill]) {
            professionWiseData[category][skill] = {
              marksAssigned: 0,
              numberOfQuestions: 0,
            };
          }
          let marksAssigned = 0;
          let answerIndex = question.answerOptions.indexOf(question.selectedAnswer) +1;
          if (answerIndex == 1) {
            marksAssigned = 1;
          } else if (answerIndex == 2) {
            marksAssigned = 2;
          } else if (answerIndex == 3) {
            marksAssigned = 3;
          } else if (answerIndex == 4) {
            marksAssigned = 4;
          } else if (answerIndex == 5) {
            marksAssigned = 5;
          }
          professionWiseData[category][skill].marksAssigned += marksAssigned;
          professionWiseData.Overview[category].marksAssigned += marksAssigned;
          professionWiseData[category][skill].numberOfQuestions++;
          professionWiseData.Overview[category].numberOfQuestions++;
        }
      }
    }
    for (const category in professionWiseData) {
      for (const skill in professionWiseData[category]) {
        professionWiseData[category][skill] =
          professionWiseData[category][skill].marksAssigned / professionWiseData[category][skill].numberOfQuestions;
      }
    }
    return res.json({ message: "Answers fetched successfully", data: professionWiseData, profession: professionData[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Error while updating questions" });
  }
});
module.exports = router;
