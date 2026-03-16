import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import { initializeSocket } from './sockets';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces', projectRoutes);
app.use('/api/workspaces', taskRoutes);
app.use('/api/workspaces', activityLogRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Silid API is running' });
});

const startServer = async (): Promise<void> => {
  await connectDB();
  initializeSocket(httpServer);

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app;
