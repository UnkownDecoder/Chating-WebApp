// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const reviewRouter = require('./routers/reviewRouter');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define a route for the root path ("/")
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// API Routes for reviews
app.use('/api/reviews', reviewRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Start the server after successful database connection
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process with failure if DB connection fails
  });


// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle uncaught errors globally
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1); // Exit the process in case of uncaught exception
});




