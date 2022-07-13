const mongoose = require("mongoose")
const Quizz = mongoose.model("quizz")
const InfoDiapo = mongoose.model("infodiapo")

const createQuizz = async (req, res) => {
  const { question, possibilities } = req.body
  const { pageId } = req.params

  const tableOfQuizz = []

  for (const element of possibilities) {
    let object = {}
    const { choice, answer } = element
    object.choice = choice
    object.answer = answer
    tableOfQuizz.push(object)
  }


  const newQuizz = new Quizz({
    question,
    possibilities: tableOfQuizz,
    count: 0
  })


  try {
    await newQuizz.save()
    const data = await InfoDiapo.findByIdAndUpdate(
      pageId,
      { $push: { quizzs: newQuizz.id } },
      { new: true }
    ).populate([
      {
        path: "quizzs",
        model: "quizz",
        select: "_id question possibilities count",
      },
    ])
    return res.status(200).json(data.quizzs.slice(-1).pop())
  } catch (e) {
    return res.status(500).json(e)
  }
}

const getQuizz = async (req, res) => {
  const { pageId } = req.params

  try {
    const data = await InfoDiapo.findById(pageId)
      .select("quizzs")
      .populate([
        {
          path: "quizzs",
          model: "quizz",
          select: "_id question possibilities count",
        },
      ])
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json(e)
  }
}

const updateQuizz = async (req, res) => {
  const { quizzId } = req.params

  let { question, choice, answer, count } = req.body
  const updates = {}
  const otherUpdates = {} 

  if (question?.length) {
    otherUpdates.question = question
  }
  if (choice?.length) {
    updates.choice = choice
  }
  if (answer?.length) {
    updates.answer = answer
  }
  if (count) {
    updates.count = count
  }

  try {
    const data = await Quizz.findByIdAndUpdate(quizzId, otherUpdates)
    for (const element of data.possibilities) {
      if (req.params.elementQuizzId === element._id.toString()) {
        await Quizz.update(
          { "possibilities._id": req.params.elementQuizzId },
          {
            $set: {
              "possibilities.$.choice": updates.choice
                ? updates.choice
                : element.choice,
              "possibilities.$.answer": updates.answer
                ? updates.answer
                : element.answer,
              "possibilities.$.count": updates.count ? updates.count : element.count,
            },
          }
        )
      }
    }
    return res.status(200).json({message: "updates quizz"})
  } catch (e) {
    return res.status(500).json(e)
  }
}

const deleteQuizz = async (req, res) => {
  const { quizzId } = req.params

  try {
    await Quizz.remove({ _id: quizzId })
    return res.status(200).json({ message: "quizz delete" })
  } catch (e) {
    return res.status(500).json(e)
  }
}

module.exports = { createQuizz, getQuizz, updateQuizz, deleteQuizz }
