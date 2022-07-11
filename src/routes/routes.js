module.exports = (app) => {
  const {
    verifyToken,
  } = require("../controllers/token/verifyToken.controller.js")
  const multer = require("../utils/multer.utils.js")
  const authController = require("../controllers/auth/auth.controller.js")
  const userController = require("../controllers/user/user.controller.js")
  const fileController = require("../controllers/file/file.controller.js")
  const surveyController = require("../controllers/survey/survey.controller.js")
  const quizzController = require("../controllers/quizz/quizz.controller.js")
  const noteController = require("../controllers/note/note.controller.js")

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

  /*
  * COOKIE
  */
  app.get('/delete-cookie', (req, res) => {
    const cookies = req.cookies
    if(cookies.cookieUser) {
      res.clearCookie('cookieUser')
      return res.status(200).json("Cookie was delete")
    }
  })

  /**
   * USER
   */
  app.get("/api/user", userController.getCurrentUser)
  app.put("/api/user/profile", userController.updateProfileCurrentUser)
  app.delete("/api/user", userController.deleteCurrentUser)

  /**
   * DIAPO
   */
  app.post("/api/diapo", multer, fileController.addFile)
  app.get("/api/diapo", fileController.getAllFile)
  app.get("/diapo/:diapoId", fileController.getFileByDiapoId)
  app.put("/api/diapo/params/:diapoId", fileController.switchParamsDiapo)
  app.delete("/api/diapo/:diapoId", fileController.deleteFile)

  /**
   * SURVEY
   */
  app.get("/api/survey/:pageId", surveyController.getSurvey)
  app.post("/api/survey/:pageId", surveyController.createSurvey)
  app.put("/api/survey/:surveyId", surveyController.updateSurvey)
  app.delete("/api/survey/:surveyId", surveyController.deleteSurvey)

  /**
   * QUIZZ
   */
  app.get("/api/quizz/:pageId", quizzController.getQuizz)
  app.post("/api/quizz/:pageId", quizzController.createQuizz)
  app.put("/api/quizz/:quizzId", quizzController.updateQuizz)
  app.delete("/api/quizz/:quizzId", quizzController.deleteQuizz)

  /**
   * NOTE
   */
  app.get("/api/note/:pageId", noteController.getNote)
  app.post("/api/note/:pageId", noteController.createNote)
  app.put("/api/note/:noteId", noteController.updateNote)
  app.delete("/api/note/:noteId", noteController.deleteNote)

  /**
   * 404 NOT FOUND
   */

  app.use((req, res) => {
    res.status(404).json({
      URL_ERROR: req.originalUrl,
      STATUS_ERROR: "404",
      ERROR: "NOT FOUND",
    })
  })
}
