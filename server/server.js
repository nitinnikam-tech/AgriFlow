import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});
app.set('io', io);

// Security Headers
app.use(helmet());

// Rate Limiting (lightweight for SIH demo)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', apiRoutes);

app.get('/health', async (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'AgriFlow Backend & Real-Time Queue Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0-sih2026'
  });
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🌾 AgriFlow Server running on http://localhost:${PORT}`);
  console.log(`⚡ Real-Time Socket.IO initialized on port ${PORT}`);
  console.log(`📊 Mode: SIH 2026 Competition Prototype Dual-Mode`);
  console.log('====================================================');
});

export { app, server, io };
