import { swaggerSpec } from './swagger';
import { ErrorMiddleware } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { verifyToken } from './middleware/auth.middleware';
import express, { Request, Response } from 'express';

import universityRoutes from './routes/university.routes';
import laundryUserRoutes from './routes/laundryUser.routes';
import laundryMachineRoutes from './routes/laundryMachine.routes';
import laundryHallRoutes from './routes/laundryHall.routes';
import studentLedgerRoutes from './routes/studentLedger.routes';
import discountPolicyRoutes from './routes/discountPolicy.routes';
import washesHistoryRoutes from './routes/washesHistory.routes';
import logFilesRoutes from './routes/logFiles.routes';

const app = express();

// Middleware
app.use(express.json());

// Public routes
app.use('/api/public', (req: Request, res: Response) => {
  res.json({ message: 'This is a public endpoint' });
});

// Protected routes
app.get('/api/protected', verifyToken, (req: Request, res: Response) => {
  res.json({
    message: 'This is a protected endpoint',
    user: (req as any).user,
  });
});

// Routes
app.use('/api/log-files', logFilesRoutes);
app.use('/api/washes-history', washesHistoryRoutes);
app.use('/api/discount-policies', discountPolicyRoutes);
app.use('/api/ledger', studentLedgerRoutes);
app.use('/api/halls', laundryHallRoutes);
app.use('/api/machines', laundryMachineRoutes);
app.use('/api/laundryUser', laundryUserRoutes);
app.use('/api/universities', universityRoutes);

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
