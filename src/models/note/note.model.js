const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let NoteSchema = new Schema({
  description: { type: String },
});

mongoose.model("note", NoteSchema);
