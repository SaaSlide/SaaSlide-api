const mongoose = require("mongoose")
const Survey = mongoose.model("survey")
const InfoDiapo = mongoose.model("infodiapo")

const createSurvey = async (req, res) => {
  const { name, survey } = req.body
  const { pageId } = req.params

  const tableOfSurvey = []

  for (const element of survey) {
    let object = {}
    const { proposition } = element
    object.proposition = proposition
    tableOfSurvey.push(object)
  }

  const newSurvey = new Survey({
    name,
    survey: tableOfSurvey,
    count: 0,
  })

  try {
    await newSurvey.save()
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
    ])
    return res.status(200).json(data.surveys.slice(-1).pop())
  } catch (e) {
    return res.status(500).json(e)
  }
}

const getSurvey = async (req, res) => {
  const { pageId } = req.params

  try {
    const data = await InfoDiapo.findById(pageId)
      .select("surveys")
      .populate([
        {
          path: "surveys",
          model: "survey",
          select: "_id name survey",
        },
      ])
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const updateSurvey = async (req, res) => {
  const { surveyId } = req.params

  let { name, proposition, count } = req.body
  const updates = {}
  const otherUpdates = {} 

  if (name?.length) {
    otherUpdates.name = name
  }
  if (proposition?.length) {
    updates.proposition = proposition
  }

  if (count) {
    updates.count = count
  }

  try {
    const data = await Survey.findByIdAndUpdate(surveyId, otherUpdates)
    for (const element of data.survey) {
      if (req.params.elementSurveyId === element._id.toString()) {
        await Survey.update(
          { "survey._id": req.params.elementSurveyId },
          {
            $set: {
              "survey.$.proposition": updates.proposition
                ? updates.proposition
                : element.proposition,
              "survey.$.count": updates.count ? updates.count : element.count,
            },
          }
        )
      }
    }
    return res.status(200).json({message: "updates survey"})
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const deleteSurvey = async (req, res) => {
  const { surveyId } = req.params

  try {
    await Survey.remove({ _id: surveyId })
    return res.status(200).json({ message: "survey delete" })
  } catch (e) {
    return res.status(500).json(e)
  }
}

module.exports = { createSurvey, getSurvey, updateSurvey, deleteSurvey }
