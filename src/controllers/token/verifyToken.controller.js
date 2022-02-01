let jwtUtils = require("../../utils/jwt.utils.js")
let jwt = require("jsonwebtoken")

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

const verifyToken = async (req, res, next) => {
  let token = extractToken(req)
  let userData = -1
  token = jwtUtils.parseAuthorization(token)

  if (token != null) {
    try {
      let decoded = jwt.decode(token);
      console.log(decoded)
      let jwtToken = jwt.verify(token, process.env.JWT_SIGN_SECRET)
      if (jwtToken != null) {
        userData = jwtToken
      }
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: "jwt malformed" })
    }
  }
  if (userData != -1) {
    return next()
  } else {
    return res.status(400).json({ message: "No token" })
  }
}

module.exports = {
  verifyToken,
}
