const express = require('express');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const cors = require('cors');
const app = express();
const config = require('./config');
require('./config/passport'); // Load configuration

//Listener
const server = app.listen(config.port, () => {
  console.log(`Server connected to port ${config.port}`);
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// General Routes
app.use('/api/auth', require('./routes/auth.routes')); // #swagger.tags = ['Auth'] #swagger.description = 'Endpoints for authentication'
app.use('/api/category', require('./routes/category.routes')); // #swagger.tags = ['Category'] #swagger.description = 'Endpoints for category operations'
app.use('/api/product', require('./routes/product.routes')); // #swagger.tags = ['Product'] #swagger.description = 'Endpoints for product operations'
app.use('/api/cart', require('./routes/cart.routes')); // #swagger.tags = ['Cart'] #swagger.description = 'Endpoints for cart operations'

// Handling Error
process.on('unhandledRejection', err => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
