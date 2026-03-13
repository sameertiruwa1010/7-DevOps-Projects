require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const taskRoutes = require('./routes/tasks');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// ─── General Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
  skip: (req) => req.url === '/api/health',
}));

// ─── Database Connection ───────────────────────────────────────────────────────
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => logger.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => logger.info('✅ MongoDB reconnected'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/tasks', taskRoutes);

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      logger.info('Server and database connections closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    shutdown('UNHANDLED_REJECTION');
  });
};

startServer();

module.exports = app;
