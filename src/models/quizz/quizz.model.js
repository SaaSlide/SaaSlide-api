const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let QuizzSchema = new Schema({
  name: { type: String },
  quizz: [],
});

mongoose.model("quizz", QuizzSchema);
