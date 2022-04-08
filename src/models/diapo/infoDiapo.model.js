const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let InfoDiapoSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
    page: {
      type: Number,
      required: false,
    },
  }
);

mongoose.model("infodiapo", InfoDiapoSchema);
