const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + ".pdf");
    } 
});
  
module.exports = multer({storage: storage}).single('file');