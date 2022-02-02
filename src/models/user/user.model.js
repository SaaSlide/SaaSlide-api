const mongoose = require("mongoose")
const Schema = mongoose.Schema

let UserSchema = new Schema({
  name: { type: String },
  mail: { type: String, unique: true },
  password: { type: String },
  picture: { type: String},
})

mongoose.model("user", UserSchema)
