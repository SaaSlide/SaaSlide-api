const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const figlet = require("figlet")
const bodyParser = require("body-parser")
const process = require("process")

const winston = require("./src/config/winston.js")

require("dotenv").config()

const app = express()

// enable cors
app.use(cors())
app.options("*", cors())

// parse json request body
app.use(express.json())

// set security HTTP headers
app.use(helmet())

// Display logs of api
app.use(morgan("combined", { stream: winston.stream }))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

require("./src/routes/routes.js")(app)

// set port, listen for requestsxs
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  figlet(
    process.env.NAME_APP,
    {
      font: "Big Money-ne",
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 180,
      whitespaceBreak: false,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...")
        console.dir(err)
        return
      }
      console.log(data)
      console.log(`Server is running on port ${PORT}.`)
    }
  )
})

module.exports = app
