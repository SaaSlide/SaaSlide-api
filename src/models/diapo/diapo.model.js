const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let DiapoSchema = new Schema(
  {
    infoDiapo: [
      {
        type: Schema.Types.ObjectId,
        ref: "infodiapo",
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model("diapo", DiapoSchema);
