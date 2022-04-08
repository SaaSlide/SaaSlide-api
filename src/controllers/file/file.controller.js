const mongoose = require("mongoose");
const Diapo = mongoose.model("diapo");
const { fromPath } = require("pdf2pic");
const pdf = require("pdf-page-counter");
const fs = require("fs");

const addFile = async (req, res) => {
  const hostname = req.headers.host;
  if (req.file) {
    const newDiapo = new Diapo({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      path: "http://" + hostname + "/" + req.file.path,
      users: req.userId,
    });
    await newDiapo.save();
    return res.status(200).json({ message: "file upload" });
  } else {
    return res.status(400).json({ message: "Oups ! error T_T" });
  }
};

const pdfToPng = async (req, res) => {
  const { filename } = req.query;
  const options = {
    density: 100,
    saveFilename: "file",
    savePath: "./public/pdfToPng",
    format: "png",
    width: 1920,
    height: 1080,
  };
  let arrayOfPng = [];
  const storeAsImage = fromPath(`./public/uploads/${filename}`, options);
  let dataBuffer = fs.readFileSync(`./public/uploads/${filename}`);
  pdf(dataBuffer)
    .then(async function (data) {
      for (
        let pageToConvertAsImage = 1;
        pageToConvertAsImage <= data.numpages;
        pageToConvertAsImage++
      ) {
        const data = await storeAsImage(pageToConvertAsImage);
        arrayOfPng.push(data);
      }
    })
    .then(() => {
      res.send({ filename: arrayOfPng });
    });
};
const getAllFile = async (req, res) => {
  try {
    const data = await Diapo.find();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getFileByDiapoId = async (req, res) => {
  try {
    const data = await Diapo.findOne({ _id: req.params.diapoId });
    if (data === null) {
      return res.status(400).json("You don't have any diapo with this id");
    }
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = { addFile, pdfToPng, getAllFile, getFileByDiapoId };
