const mongoose = require("mongoose")
const User = mongoose.model("user")

const createUser = async (req, res) => {

  let { name, password, email } = req.body

  let user = new User({
    name,
    password,
    email
  })

  try {
    await user.save()
    return res.status(201).json({ message: "create user" })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ message: "error create user" })
  }
}


module.exports = { createUser }
