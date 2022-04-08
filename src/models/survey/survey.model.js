const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SurveySchema = new Schema({
  name: { type: String },
  survey: [{ type: String }],
});

mongoose.model("survey", SurveySchema);
