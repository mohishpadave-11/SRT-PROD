<<<<<<< HEAD
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
=======
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const documentRoutes = require('./routes/documentRoutes'); // 👈 1. Import Document Routes

// Import Error Handler
const errorHandler = require('./middleware/errorHandler');

// Import Rate Limiting
const { generalRateLimit } = require('./middleware/rateLimiting');

require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable for file uploads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate Limiting - Apply to all requests
app.use(generalRateLimit);

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS Configuration - Restrict origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] // Production: Only allow your frontend domain
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']; // Development: Allow common dev ports

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/documents', documentRoutes); // 👈 2. Use Document Routes

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Connect to DB and start server
// 👇 3. RESET DB ONCE to create the new Documents table
// ⚠️ WARNING: This wipes your data! Change back to { alter: true } after you run this successfully once.
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected & Tables Created');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });
>>>>>>> prod/main
