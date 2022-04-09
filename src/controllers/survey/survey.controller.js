const mongoose = require("mongoose");
const Survey = mongoose.model("survey");
const InfoDiapo = mongoose.model("infodiapo");

const createSurvey = async (req, res) => {
  const { name, survey } = req.body;
  const { pageId } = req.params;
  const newSurvey = new Survey({
    name,
    survey,
  });

  try {
    await newSurvey.save();
    await InfoDiapo.findByIdAndUpdate(
      pageId,
      { $push: { surveys: newSurvey.id } },
      { new: true }
    );
    return res.status(200).json({ message: "success" });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getSurvey = async (req, res) => {
  const { pageId } = req.params;

  try {
    const data = await InfoDiapo.findById(pageId)
      .select("surveys")
      .populate([
        {
          path: "surveys",
          model: "survey",
          select: "_id name survey",
        },
      ]);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = { createSurvey, getSurvey };
