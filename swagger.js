const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Quizzer API",
      version: "1.0.0",
      description: "Backend API documentation for AI Quizzer",
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/v1`
          : "http://localhost:5000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api-docs`
    : "http://localhost:5000/api-docs";

  console.log(`Swagger Docs available at: ${url}`);
}

module.exports = swaggerDocs;
