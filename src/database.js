const mongoose = require('mongoose');
const config = require('./config');

if (!config.mongo.uri) {
  console.error('MongoDB URL is not defined in environment variables');
  process.exit(1); // Exit the application if URL is not defined
}

mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose
  .connect(config.mongo.uri, {})
  .then(() => {
    console.log('DB is connected');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the application if connection fails
  });

// Handling connection events
const connection = mongoose.connection;

connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

connection.once('open', () => {
  console.log('DB connection is open');
});

connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});
