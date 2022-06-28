const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const figlet = require("figlet");
const bodyParser = require("body-parser");
const process = require("process");
const cookieParser = require("cookie-parser");

const winston = require("./src/config/winston.js");

require("dotenv").config();

const app = express();
app.use("/public", express.static(__dirname + "/public"));
// enable cors
app.use(cors());
app.options(
  "http://localhost:3000",
  cors({
    credentials: true,
  })
);
// parse json request body
app.use(express.json());
app.use(cookieParser());

app.enable("trust proxy");
// Display logs of api
app.use(morgan("combined", { stream: winston.stream }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

require("./src/models/db");
require("./src/routes/routes.js")(app);

// set port, listen for requestsxs
const PORT = process.env.PORT;

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
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
      console.log(`Server is running on port ${PORT}.`);
    }
  );
});

module.exports = app;
