module.exports = (app) => {

  /**
   * TEST API
   */
  app.get("/", (req, res) => {
    res.send("Welcome to the jungle of the SaaSlide API.")
  })

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
