import express, { Request, Response } from 'express';
import cors from 'cors';
import agentRoutes from './routes/agentRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/agents', agentRoutes);

// Simple health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'PURE Home River API is running!' });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
