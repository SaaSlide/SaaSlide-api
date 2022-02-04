const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const process = require('process');

const addFile = async (req, res) => {

  AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
  });

  var s3 = new AWS.S3();
  var filePath = req.file.path;

  //configuring parameters
  var params = {
    Bucket: process.env.bucketName,
    Body: fs.createReadStream(filePath),
    Key: "test/" + Date.now() + "_" + path.basename(filePath)
  };

  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log(err)
      return res.status(500).json({ message: "error upload" })
    }

    //success
    if (data) {
      console.log(data)
      return res.status(500).json({ message: "success upload" })
    }
  });

}

const getFile = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
  });

  var fileName = "test/1643744751694_1643744751678-test2.png"

  var s3 = new AWS.S3();

  var params = {
    Bucket: process.env.bucketName,
    Key: fileName,
  };

  var writableStream = fs.createWriteStream("../../../uploads")

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      return res.status(500).json({ message: "error download" })
    }

    else {
      // var blob = new Blob( [ data.Body.buffer ], { type: "application/octet-stream" } )
      // var urlCreator = window.URL || window.webkitURL;
      // var imageUrl = urlCreator.createObjectURL( blob );
      // var img = document.querySelector( "#photo" );
      // img.src = imageUrl;
      // console.log(imageUrl);
      
      return res.status(201).json({ message: "success download" })
    }
  });
  

}

module.exports = { addFile, getFile }