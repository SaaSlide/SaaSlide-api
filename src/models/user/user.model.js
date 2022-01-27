const mongoose = require("mongoose")
const Schema = mongoose.Schema

let UserSchema = new Schema({
  pseudo: { type: String },
  mail: { type: String, unique: true },
  password: { type: String },
})

mongoose.model("user", UserSchema)
