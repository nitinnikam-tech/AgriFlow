import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
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
