const mongoose = require("mongoose")
const User = mongoose.model("user")
var bcrypt = require("bcrypt")
var jwtUtils = require("../../utils/jwt.utils.js")

const register = async (req, res) => {
  let { name, mail, password } = req.body

  if (!name || !mail || !password) {
    return res.status(400).json({ message: "missing name, mail or password" })
  }

  bcrypt.hash(password, 3, async (err, hash) => {
    let user = new User({
      name: name,
      mail: mail,
      password: hash,
    })

    try {
      await user.save()
      return res.status(201).json({ message: "create" })
    } catch (e) {
      if (err.message.indexOf("11000") != -1) {
        return res.status(400).json({ message: "error mail already exists" })
      } else {
        return res.status(400).json({ message: "error create new account" })
      }
    }
  })
}

const login = async (req, res) => {
  let { mail, password } = req.body

  if (!password || !mail) {
    return res.status(400).json({ error: "missing parameters" })
  }
  try {

    const data = await User.findOne({ mail: mail }).select('_id name mail password')
    if (data) {
      bcrypt.compare(password, data.password, async (err, response) => {
        if(response){
          try {
            let token = jwtUtils.generateTokenForUser(data)
            return res.status(200).json({
              id: data._id,
              name: data.name,
              mail: data.mail,
              token: token,
            })
          } catch (e) {
            return res.status(400).json("Oups ! error T_T")
          }
        }else {
          return res.status(400).json({ error: "invalid password"})
        }
      })
    } else {
      return res.status(500).json({ error: "invalid email" })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: "unable to verify user" })
  }
}

module.exports = { register, login }
