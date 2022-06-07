const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let QuizzSchema = new Schema({
  question: { type: String },
  possibilities: [
    { 
      choice: String, 
      answer: Boolean, 
      count: {
        type: Number,
        default: 0,
      }
    }
  ],
});

mongoose.model("quizz", QuizzSchema);
