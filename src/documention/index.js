import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Reach",
      version: "1.0.0",
      description: "Car rentals and Selling",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Reach",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "/",
      },
      {
        url: "https://locar-api.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        BearerToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/**/*.doc.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;