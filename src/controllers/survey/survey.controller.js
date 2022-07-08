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
    ).populate([
      {
        path: "surveys",
        model: "survey",
        select: "_id name survey",
      },
    ]);
    return res.status(200).json(data.surveys.slice(-1).pop());
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

const updateSurvey = async (req, res) => {
  const { surveyId } = req.params;

  let { name, survey } = req.body;
  const updates = {};

  if (name?.length) {
    updates.name = name;
  }
  if (survey?.length) {
    updates.survey = survey;
  }

  try {
    await Survey.findByIdAndUpdate(surveyId, updates);
    const newSurvey = {
      _id: surveyId,
      name: updates.name,
      survey: updates.survey
    }
    return res.status(200).json(newSurvey);
  } catch (e) {
    return res.status(500).json(e);
  }
}

const deleteSurvey = async (req, res) => {
  const { surveyId } = req.params;

  try {
    await Survey.remove({ _id: surveyId });
    return res.status(200).json({ message: "survey delete" });
  } catch (e) {
    return res.status(500).json(e);
  }

}

module.exports = { createSurvey, getSurvey,updateSurvey, deleteSurvey };
