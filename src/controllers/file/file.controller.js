const mongoose = require("mongoose");
const Diapo = mongoose.model("diapo");
const { fromPath } = require("pdf2pic");
const pdf = require("pdf-page-counter");
const fs = require("fs");
const User = mongoose.model("user");

const addFile = async (req, res) => {
  const hostname = req.headers.host;
  if (req.file) {
    const { filename } = req.file;
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
      .then(async function () {
        const newDiapo = new Diapo({
          infoDiapo: arrayOfPng,
          users: req.userId,
        });
        await newDiapo.save();
        return res.status(200).json({ message: "Success import" });
      });
  } else {
    return res.status(400).json({ message: "Oups ! error T_T" });
  }
};

const getAllFile = async (req, res) => {

  try {
    const data = await Diapo.find({ users: req.userId }).select("infoDiapo");
    console.log(data);
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

module.exports = { addFile, getAllFile, getFileByDiapoId };
