module.exports = (app) => {

  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      callback(null, Date.now() + "-" + name);
    }
  });
  
  const upload = multer({ storage: storage })

  const { verifyToken } = require("../controllers/token/verifyToken.controller.js")
  const authController = require("../controllers/auth/auth.controller.js")
  const userController = require("../controllers/user/user.controller.js")

  /**
   * TEST API
   */
  app.get("/", (req, res) => {
    res.send("Welcome to the jungle of the SaaSlide API.")
  })

  /**
   * API VERIFY REQUETE
   */
  /* checks if the API is well secured by a bearer Token */
  app.use("/api/", verifyToken)

  /**
   * AUTH
   */
  app.post("/auth/register", authController.register)
  app.post("/auth/login", authController.login)

  /**
   * USER
   */
  app.post("/user", userController.createUser)

  app.post('/file', upload.single('name'),  function(req, res) {
    return res.status(201).json({ message: "fichier upload" })
  });

  /**
   * 404 NOT FOUND
   */

  /* Error case of a false route */
  app.use((req, res) => {
    res.status(404).json({
      URL_ERROR: req.originalUrl,
      STATUS_ERROR: "404",
      ERROR: "NOT FOUND",
    })
  })
}
