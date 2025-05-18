// server.js
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import connectDB from './db/connectDB.js';
import setupPrivateMessaging from './privateMessage.js';

const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies
}));

connectDB();  // Connect to MongoDB
app.use(cookieParser());
app.use(express.json()); // Parse incoming JSON requests

// Set up user routes
app.use("/user", userRoutes);

// Set up private messaging
setupPrivateMessaging(server);

// Start the server
server.listen(5000, () => console.log('Server running on port 5000'));
