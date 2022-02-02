module.exports = (app) => {


  const { verifyToken } = require("../controllers/token/verifyToken.controller.js")
  const multer  = require("../utils/multer.utils.js")
  const authController = require("../controllers/auth/auth.controller.js")
  const userController = require("../controllers/user/user.controller.js")
  const fileController = require("../controllers/file/file.controller.js")
  const roleController = require("../controllers/role/role.controller.js")

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
  app.get("/api/user", userController.getUser)
  app.put("/api/user/profile", userController.updateProfile)
  app.put("/api/user/profile/picture", userController.updatePicture)
  app.put("/api/user/profile/password", userController.updatePassword)

  /**
   * FILE
   */
  app.get('/api/role', roleController.getRoleByUser);


  /**
   * FILE
   */
  app.post('/file', multer,  fileController.addFile);

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
