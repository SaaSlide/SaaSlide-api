const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
      // const name = file.originalname.split(' ').join('_');
      callback(null, Date.now() + ".png");
    } 
});
  
module.exports = multer({storage: storage}).single('file');