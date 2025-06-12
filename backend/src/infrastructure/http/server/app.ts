// Main application setup
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from '../http/middlewares/errorMiddleware';
import authRoutes from '../http/routes/authRoutes';
import userRoutes from '../http/routes/userRoutes';
import pacienteRoutes from '../http/routes/pacienteRoutes';
import profissionalRoutes from '../http/routes/profissionalRoutes';
import logger from '../../utils/logger';
import { connectToMongo } from '../persistence/mongo/mongoConnection';

// Initialize Express app
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/profissionais', profissionalRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export default app;
