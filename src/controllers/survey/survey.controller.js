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
    const data = await InfoDiapo.findByIdAndUpdate(
      pageId,
      { $push: { surveys: newSurvey.id } },
      { new: true }
    );
    return res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const getSurvey = async (req, res) => {
    console.log('getSurvey');
}

module.exports = { createSurvey, getSurvey };
