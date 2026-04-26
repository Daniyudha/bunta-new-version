const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DIMENSI API',
      version: '1.0.0',
      description: 'API documentation for CIKASDA UPT PSDA Wilayah II',
      contact: {
        name: 'CIKASDA UPT PSDA Wilayah II',
        url: 'https://irigasibunta.com',
      },
    },
    servers: [
      {
        url: 'https://be.irigasibunta.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5001',
        description: 'Development server',
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
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Irrigation Profiles',
        description: 'Irrigation profile endpoints',
      },
      {
        name: 'Water Level',
        description: 'Water level data endpoints',
      },
      {
        name: 'Rainfall',
        description: 'Rainfall data endpoints',
      },
      {
        name: 'Crops',
        description: 'Crop data endpoints',
      },
      {
        name: 'Farmers',
        description: 'Farmer data endpoints',
      },
      {
        name: 'News',
        description: 'News article endpoints',
      },
      {
        name: 'Gallery',
        description: 'Gallery image endpoints',
      },
      {
        name: 'Sliders',
        description: 'Slider/Carousel endpoints',
      },
      {
        name: 'Contact',
        description: 'Contact form submission endpoints',
      },
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/routes/data/*.js',
    './src/routes/admin/*.js',
    './src/index.js',
  ],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
