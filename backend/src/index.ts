import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import comunicadosRoutes from './routes/comunicadosRoutes';
import mensagensRoutes from './routes/mensagensRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/comunicados', comunicadosRoutes);
app.use('/api/mensagens', mensagensRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Healthcheck route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { setupSwagger } from './swagger';

// Setup Swagger (Documentação da API)
setupSwagger(app);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
