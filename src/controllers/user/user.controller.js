const mongoose = require("mongoose");
const User = mongoose.model("user");
var bcrypt = require("bcrypt");

const getCurrentUser = async (req, res) => {
  try {
    const data = await User.findById(req.userId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const updateProfileCurrentUser = async (req, res) => {
  let { name, mail, picture, password } = req.body;
  const updates = {};

  password = await bcrypt.hash(req.body.password, 3);

  if (name?.length) {
    updates.name = name;
  }
  if (mail?.length) {
    updates.mail = mail;
  }
  if (picture?.length) {
    updates.picture = picture;
  }
  if (password?.length) {
    updates.password = password;
  }
  
  try {
    await User.findByIdAndUpdate(req.userId, updates);
    return res.status(200).json({ message: "update profile" });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    await User.remove({ _id: req.userId });
    return res.status(200).json({ message: "user delete" });
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = {
  getCurrentUser,
  updateProfileCurrentUser,
  deleteCurrentUser,
};
