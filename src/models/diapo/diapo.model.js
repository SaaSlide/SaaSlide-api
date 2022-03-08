const mongoose = require("mongoose")
const Schema = mongoose.Schema

let DiapoSchema = new Schema({
  originalName: { type: String },
  fileName: {type: String},
  infoDiapo: [
      {
        type: Schema.Types.ObjectId,
        ref: "infoDiapo"
      },
  ],
  path: {type: String},
  users: [
    {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
  ],
  roleUser: [
    {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
  ],
  viewers: [
    {
      type: Schema.Types.ObjectId,
      ref: "viewer",
    },
  ],
},
{
  timestamps: true
},
)

mongoose.model("diapo", DiapoSchema)
