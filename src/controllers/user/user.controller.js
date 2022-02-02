const mongoose = require("mongoose")
const User = mongoose.model("user")

const getUser = async (req, res) => {

  try {
    const data = await User.findById(req.userId)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }

}

const updateProfile = async (req, res) => {

  let { name, mail } = req.body
  const updates = {}

  if (name?.length) {
    updates.name = name
  }
  if (mail?.length) {
    updates.mail = mail
  }

  try {
    await User.findByIdAndUpdate(req.userId, updates)
    return res.status(200).json({ message: "update profile" })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }

}

const updatePicture = async (req, res) => {
  let { picture } = req.body
  const updates = {}

  if (picture?.length) {
    updates.picture = picture
  }

  try {
    await User.findByIdAndUpdate(req.userId, updates)
    return res.status(200).json({ message: "update picture" })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const updatePassword = async (req, res) => {
  return res.status(200).json({ message: "update password" })
}



module.exports = { getUser, updateProfile, updatePicture, updatePassword }
