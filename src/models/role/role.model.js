const mongoose = require("mongoose")
const Schema = mongoose.Schema

let RoleSchema = new Schema({
  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  role: { type: Array },
  diapoId: [
    {
      type: Schema.Types.ObjectId,
      ref: "diapo",
    },
  ],
})

mongoose.model("role", RoleSchema)
