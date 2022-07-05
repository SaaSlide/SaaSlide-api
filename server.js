const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const figlet = require("figlet");
const bodyParser = require("body-parser");
const process = require("process");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

const winston = require("./src/config/winston.js");
const { send } = require("process");

require("dotenv").config();

// set port, listen for requestsxs
const PORT = process.env.PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;
const FRONT_URL = process.env.FRONT_URL;

const app = express();

// Server socket io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room, cb) => {
    socket.join(room);
    socket.data.room = room;
    cb({
      value: `Connected`,
    });

    const nUser = socket.adapter.rooms.get(room).size;
    io.in(room).emit("update_number_user", nUser);
  });

  /**
   * Sending to all clients in room except sender
   * @param {string} action
   * @param {*} data
   */
  const sender = (action, data) => {
    socket.broadcast.to(socket.data.room).emit(action, data);
  };

  socket.on("update_slide", (data) => sender("get_slide", data));

  socket.on("send_question", (data) => sender("get_question", data));

  socket.on("send_params", (data) => send("get_params", data));

  socket.on("send_response", (data) => sender("get_response", data));

  socket.on("send_smiley", (data) =>
    io.in(socket.data.room).emit("get_smiley", data)
  );

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const nUser = io.sockets.adapter.rooms.get(room).size - 1;
        io.in(room).emit("update_number_user", nUser);
      }
    }
  });
});


app.use("/public", express.static(__dirname + "/public"));
// enable cors
app.options(FRONT_URL, cors())
app.use(cors({
  origin: FRONT_URL,
  credentials: true
}))
// parse json request body
app.use(express.json())
app.use(cookieParser())

// Display logs of api
app.use(morgan("combined", { stream: winston.stream }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

require("./src/models/db");
require("./src/routes/routes.js")(app);

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
      console.log(`Server is running on port ${PORT}.`);
      httpServer.listen(SOCKET_PORT, () => {
        console.log(`Socket IO is running on port ${SOCKET_PORT}.`);
      });
    }
  );
});

module.exports = app;
