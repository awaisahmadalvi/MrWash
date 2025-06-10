import express from 'express';
import { connectToDatabase } from './config/database';
import { swaggerSpec } from './swagger';
import { ErrorMiddleware } from './middlewares/error.middleware';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/user.routes';
import universityRoutes from './routes/university.routes';
import laundryUserRoutes from './routes/laundryUser.routes';
import laundryMachineRoutes from './routes/laundryMachine.routes';
import laundryHallRoutes from './routes/laundryHall.routes';

dotenv.config();

const app = express();

// Database connection
connectToDatabase();

// Middleware
app.use(express.json());

// Routes
app.use('/api/halls', laundryHallRoutes);
app.use('/api/machines', laundryMachineRoutes);
app.use('/api/laundryUser', laundryUserRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/users', userRoutes);

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Handle 404
app.use(ErrorMiddleware.handleNotFound);

// Handle errors
app.use(ErrorMiddleware.handleError);

export default app;
