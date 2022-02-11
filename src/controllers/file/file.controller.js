const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const process = require('process');

const addFile = async (req, res) => {
  if(req.file) {
    return res.status(200).json({ message: "file upload" })
  } else {
    return res.status(400).json({ message: "Oups ! error T_T" })
  }
}

const getAllFiles = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
  });

  var s3 = new AWS.S3();

  const response = await s3.listObjectsV2({
    Bucket: process.env.bucketName,
  }).promise();

  let data = []

  for (const content of response.Contents){
    const url = "https://saaslide-test-charles.s3.eu-west-3.amazonaws.com/"
    const key = content.Key
    let completeUrl = {
      url: url + key
    }
    data.push(completeUrl)
  }

  try {
    return res.status(200).json(data)
  } catch (e) {
    return res.status(400).json("Oups ! error T_T")
  }

}

module.exports = { addFile, getAllFiles }