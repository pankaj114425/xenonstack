const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// dotenv config
dotenv.config();
console.log(process.env.NODE_MODE);

// MongoDB connection
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use((req, res, next) => {
    console.log(req);
    next();
  });
  

// Serve static HTML files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.use('/api/v1/user', require('./routes/userroute'));

// Route to serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'Login', 'Login.html'));
});

// Route to serve the register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'Register', 'Register.html'));
});

// Port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan.white
  );
});
