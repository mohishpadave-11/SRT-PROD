require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware (The Gatekeepers)
app.use(helmet()); // Security headers
app.use(cors());   // Allow Frontend to talk to Backend
app.use(express.json()); // Parse JSON bodies (req.body)

// 2. Database Connection Test
// We connect manually here just to check if it works on startup
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// 3. Test Route (To check if server is alive)
app.get('/', (req, res) => {
  res.send('SRT Shipping CRM API is Running 🚀');
});

// 4. Start Server
const startServer = async () => {
  try {
    // Try connecting to DB
    await sequelize.authenticate();
    console.log('Database connected successfully (Supabase).');

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();