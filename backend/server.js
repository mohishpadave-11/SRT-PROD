const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const documentRoutes = require('./routes/documentRoutes'); // 👈 1. Import Document Routes
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import Error Handler
const errorHandler = require('./middleware/errorHandler');

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

// Middleware
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------------------
// ✅ CORS FIX: Allow all necessary origins (Dev, Prod, Localhost)
// This list works in BOTH Production and Development modes automatically.
// -------------------------------------------------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,                // Render Environment Variable
  "https://srt-dev.vercel.app",            // 👈 Explicitly allow your DEV Frontend
  "https://srt-prod.vercel.app",
    "https://srt-dev-puce.vercel.app",           // Explicitly allow Production
  "http://localhost:5173",                 // Allow Localhost (Vite)
  "http://localhost:3000",                 // Allow Localhost (React/Node)
  "http://127.0.0.1:5173"                  // Allow Local IP
].filter(Boolean); // Removes empty values if a variable is missing

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // 🔍 Log the blocked origin so you can see it in Render Logs if it fails
      console.log("🚫 Blocked by CORS:", origin);
      callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    }
  },
  credentials: true, // Allow cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// -------------------------------------------------------------------------

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/documents', documentRoutes); // 👈 2. Use Document Routes
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// ... (rest of your code above stays the same)

const PORT = process.env.PORT || 3001;

// Connect to DB and start server
// 👇 CHANGED: Switched to sync({ alter: true }) to add the missing columns
sequelize.sync() 
  .then(() => {
    console.log('✅ Database connected & Tables Updated');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });
