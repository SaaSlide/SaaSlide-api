const swaggerJsDoc = require("swagger-jsdoc")

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Documentation SaaSlide Api",
      version: "1.0.0",
    },
  },
  apis: ["server.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = swaggerDocs
