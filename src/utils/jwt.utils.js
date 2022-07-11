let jwt = require("jsonwebtoken")
const process = require("process")

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET

const generateTokenForUser = (userData) => {
  return jwt.sign(
    {
      id: userData._id,
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: "24h",
    }
  )
}

const parseAuthorization = (authorization) => {
  return authorization != null ? authorization.replace("Bearer ", "") : null
}

const getUserId = (authorization) => {
  // eslint-disable-next-line no-undef
  userData = -1
  var token = module.exports.parseAuthorization(authorization)
  if (token != null) {
    try {
      var jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
      if (jwtToken != null) {
        // eslint-disable-next-line no-undef
        userData = jwtToken.userData
      }
    } catch (err) {
      console.log(err)
    }
  }
  // eslint-disable-next-line no-undef
  return userData
}

module.exports = { generateTokenForUser, parseAuthorization, getUserId }
