const mongoose = require("mongoose")
const Diapo = mongoose.model("diapo")
const path = require('path');
const fs = require('fs');

const addFile = async (req, res) => {
  const hostname = req.headers.host;
  if(req.file) {
    const newDiapo = new Diapo({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      path: 'http://' + hostname + '/' + req.file.path,
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
    const data = await Diapo.find();
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const getFileByDiapoId = async (req, res) => {

  try {
    const data = await Diapo.findOne({_id: req.params.diapoId});
    if(data === null) {
      return res.status(400).json("You don't have any diapo with this id")
    }
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const getFileHello = async (req, res) => {
  var file = fs.createReadStream("./public/uploads/1646917540900.pdf");
  var stat = fs.statSync("./public/uploads/1646917540900.pdf");
  res.setHeader("Content-length", stat.size);
  res.setHeader("Content-type", "application/pdf");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Disposition",'attachment; filename=file.pdf');
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  ); 
  return file.pipe(res);
};


module.exports = { addFile, getAllFile, getFileByDiapoId, getFileHello }