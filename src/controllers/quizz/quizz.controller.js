const mongoose = require("mongoose");
const Quizz = mongoose.model("quizz");
const InfoDiapo = mongoose.model("infodiapo");

const createQuizz = async (req, res) => {
  const { name, quizz } = req.body;
  const { pageId } = req.params;

  const newQuizz = new Quizz({
    name,
    quizz,
  });

  try {
    await newQuizz.save();
    await InfoDiapo.findByIdAndUpdate(
      pageId,
      { $push: { quizzs: newQuizz.id } },
      { new: true }
    );
    return res.status(200).json({ message: "create quizz" });
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
          select: "_id name quizz",
        },
      ]);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = { createQuizz, getQuizz };
