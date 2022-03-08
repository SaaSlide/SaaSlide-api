const mongoose = require("mongoose")
const Diapo = mongoose.model("diapo")

const addFile = async (req, res) => {

  if(req.file) {
    const newDiapo = new Diapo({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      path: req.file.path,
      users: req.userId
    })
    await newDiapo.save();
    return res.status(200).json({ message: "file upload" })
  } else {
    return res.status(400).json({ message: "Oups ! error T_T" })
  }
}

const getAllFile = async (req, res) => {
  try {
    const data = await Diapo.find().where('users').in(req.userId);
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const getFileByDiapoId = async (req, res) => {

  try {
    const data = await Diapo.findOne({_id: req.params.diapoId}).where('users').in(req.userId);
    if(data === null) {
      return res.status(400).json("You don't have any diapo with this id")
    }
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

module.exports = { addFile, getAllFile, getFileByDiapoId }