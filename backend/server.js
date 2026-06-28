import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/resumes', resumeRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'API is running' });
    });

    app.get('/', (req, res) => {
      res.send('API is running successfully');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
