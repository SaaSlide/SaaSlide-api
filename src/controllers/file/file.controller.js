const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const process = require('process')

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
      Body : fs.createReadStream(filePath),
      Key : "test/"+Date.now()+"_"+path.basename(filePath)
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

module.exports = { addFile }