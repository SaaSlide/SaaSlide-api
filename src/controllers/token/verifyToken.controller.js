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
  token = jwtUtils.parseAuthorization(token)

  if (token != null) {
    try {
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SIGN_SECRET)
      if (decoded != null) {
        req.userId = decoded.id
        next()
      }
    } catch (err) {
      return res.status(400).json({ message: "jwt malformed" })
    }
  }
  else {
    return res.status(400).json({ message: "No token" })
  }
}

module.exports = {
  verifyToken,
}
