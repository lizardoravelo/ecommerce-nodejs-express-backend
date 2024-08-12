const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Swagger Express API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes/*.js')], // Path to the API docs
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpecs;
