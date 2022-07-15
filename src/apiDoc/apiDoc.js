const swaggerJsDoc = require("swagger-jsdoc")

const swaggerOptions = {
  definition: {
    oneapi: "3.0.0",
    info: {
      title: "SaaSlide Api",
      version: "1.0.0",
      description: "Documentation SaaSlide Api",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = swaggerDocs
