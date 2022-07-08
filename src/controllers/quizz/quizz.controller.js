const mongoose = require("mongoose");
const Quizz = mongoose.model("quizz");
const InfoDiapo = mongoose.model("infodiapo");

const createQuizz = async (req, res) => {
  const { question, possibilities } = req.body;
  const { pageId } = req.params;

  const tableOfQuizz = [];

  for (const element of possibilities) {
    let object = {};
    const { choice, answer } = element;
    object.choice = choice;
    object.answer = answer;
    tableOfQuizz.push(object);
  }


  const newQuizz = new Quizz({
    question,
    possibilities: tableOfQuizz,
  });


  try {
    await newQuizz.save();
    const data = await InfoDiapo.findByIdAndUpdate(
      pageId,
      { $push: { quizzs: newQuizz.id } },
      { new: true }
    ).populate([
      {
        path: "quizzs",
        model: "quizz",
        select: "_id question possibilities",
      },
    ]);
    return res.status(200).json(data.quizzs.slice(-1).pop());
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getQuizz = async (req, res) => {
  const { pageId } = req.params;

  try {
    const data = await InfoDiapo.findById(pageId)
      .select("quizzs")
      .populate([
        {
          path: "quizzs",
          model: "quizz",
          select: "_id question possibilities",
        },
      ]);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const updateQuizz = async (req, res) => {
  const { quizzId } = req.params;

  let { question, quizz } = req.body;
  const updates = {};

  if (question?.length) {
    updates.question = question;
  }
  if (quizz?.length) {
    updates.quizz = quizz;
  }

  try {
   await Quizz.findByIdAndUpdate(quizzId, updates);
    const newQuizz = {
      _id: quizzId,
      question: updates.question,
      quizz: updates.quizz
    }
    return res.status(200).json(newQuizz);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const deleteQuizz = async (req, res) => {
  const { quizzId } = req.params;

  try {
    await Quizz.remove({ _id: quizzId });
    return res.status(200).json({ message: "quizz delete" });
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = { createQuizz, getQuizz, updateQuizz, deleteQuizz };
