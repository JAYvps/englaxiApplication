import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import apiRouter from './routes';

// Initialize database
initializeDatabase();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Server is healthy');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
