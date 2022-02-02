const mongoose = require("mongoose")
const Role = mongoose.model("role")

const getRoleByUser = async (req, res) => {
    try {
      const data = await Role.find()
      return res.status(200).json(data)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  
}


module.exports = { getRoleByUser }

