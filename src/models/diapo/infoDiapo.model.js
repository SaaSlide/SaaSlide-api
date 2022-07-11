const mongoose = require("mongoose")
const Schema = mongoose.Schema

let InfoDiapoSchema = new Schema({
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
  pathPdf: {
    type: String,
    required: false,
  },
  surveys: [
    {
      type: Schema.Types.ObjectId,
      ref: "survey",
    },
  ],
  quizzs: [
    {
      type: Schema.Types.ObjectId,
      ref: "quizz",
    },
  ],
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "notes",
    },
  ],
})

mongoose.model("infodiapo", InfoDiapoSchema)
