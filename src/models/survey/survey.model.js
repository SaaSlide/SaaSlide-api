const mongoose = require("mongoose")
const Schema = mongoose.Schema

let SurveySchema = new Schema({
  name: { type: String },
  survey: [
    {
      proposition: String,
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
})

mongoose.model("survey", SurveySchema)
