const mongoose = require("mongoose")
const Diapo = mongoose.model("diapo")
const InfoDiapo = mongoose.model("infodiapo")
const Survey = mongoose.model("survey")
const Quizz = mongoose.model("quizz")
const { fromPath } = require("pdf2pic")
const pdf = require("pdf-page-counter")
const fs = require("fs")

const addFile = async (req, res) => {
  if (req.file) {
    const { filename } = req.file
    const options = {
      density: 100,
      saveFilename: Date.now(),
      savePath: "./public/pdfToPng",
      format: "png",
      width: 1920,
      height: 1080,
    }
    let arrayOfPng = []
    const storeAsImage = fromPath(`./public/uploads/${filename}`, options)
    let dataBuffer = fs.readFileSync(`./public/uploads/${filename}`)
    pdf(dataBuffer)
      .then(async function (data) {
        for (
          let pageToConvertAsImage = 1;
          pageToConvertAsImage <= data.numpages;
          pageToConvertAsImage++
        ) {
          const data = await storeAsImage(pageToConvertAsImage)
          arrayOfPng.push(data)
        }
      })
      .then(async function () {
        let idsOfInfoDiapo = []
        for (const element of arrayOfPng) {
          const { name, size, fileSize, path, page } = element
          const newInfoDiapo = new InfoDiapo({
            name,
            size,
            fileSize,
            path,
            page,
            pathPdf:`./public/uploads/${filename}`
          })
          idsOfInfoDiapo.push(newInfoDiapo._id)
          await newInfoDiapo.save()
        }
        const newDiapo = new Diapo({
          infoDiapo: idsOfInfoDiapo,
          users: req.userId,
        })
        await newDiapo.save()
        return res.status(200).json({ message: "Success", id:newDiapo._id })
      })
  } else {
    return res.status(400).json({ message: "You don't have any file" })
  }
}

const getAllFile = async (req, res) => {
  try {
    const data = await Diapo.find({ users: req.userId })
      .select("infoDiapo sendAnswer sendEmoji")
      .populate({
        path: "infoDiapo",
        model: "infodiapo",
        select: "_id path pathPdf page",
      })
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json(e)
  }
}

const getFileByDiapoId = async (req, res) => {
  try {
    const data = await Diapo.findOne({ _id: req.params.diapoId })
      .select("infoDiapo sendAnswer sendEmoji")
      .populate({
        path: "infoDiapo",
        model: "infodiapo",
        select: "_id path pathPdf page surveys quizzs notes",
        populate: [
          {
            path: "surveys",
            model: "survey",
            select: "_id name survey",
          },
          {
            path: "quizzs",
            model: "quizz",
            select: "_id question possibilities",
          },
          {
            path: "notes",
            model: "note",
          },
        ],
      })
    if (data === null) {
      return res.status(400).json("You don't have any diapo with this id")
    }
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json(e)
  }
}

const switchParamsDiapo = async (req, res) => {
  const { emoji, answer } = req.query
  const { diapoId } = req.params

  try {
    await Diapo.findByIdAndUpdate(
      diapoId,
      {
        $set: { sendEmoji: emoji, sendAnswer: answer },
      },
      { new: true }
    )
    return res.status(200).json({ message: "params are successfully updated" })
  } catch (e) {
    return res.status(500).json(e)
  }
}

const deleteFile = async (req, res) => {
  try {
      const diapo = await Diapo.findById(req.params.diapoId)
      let deleteDiapo = false
      for (const element of diapo.infoDiapo) {
        const infoDiapo = await InfoDiapo.findById(element)
        if (infoDiapo) {
          let { surveys, quizzs, path } = infoDiapo
          path = path.substring(2)
          if(fs.existsSync(path)) {
            fs.unlinkSync(path)
          }
          for (const surveyId of surveys) {
            const survey = await Survey.findById(surveyId)
            if(survey) {
              await Survey.remove({ _id: survey._id })
            }
          }
          for (const quizzId of quizzs) {
            const quizz = await Quizz.findById(quizzId)
            if (quizz) {
              await Quizz.remove({ _id: quizz._id })
            }
          }
          if (surveys.length === 0 && quizzs.length === 0) {
            const infoDiapo = await InfoDiapo.findById(element)
            if(infoDiapo) {
              await InfoDiapo.remove({ _id: infoDiapo._id })
              deleteDiapo = true
            }
          }
        }
      }
      if(deleteDiapo) {
        await Diapo.remove({ _id: req.params.diapoId })
      }
    return res.status(200).json({ message: "diapo delete" })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

module.exports = {
  addFile,
  getAllFile,
  getFileByDiapoId,
  switchParamsDiapo,
  deleteFile,
}
