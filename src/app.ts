import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectMongoDB from './config/db';
import index from './routes';
import invalidUrlHandler from './middlewares/invalidUrlHandler';
import errorHandler from './middlewares/errorHandler';
import loaders from './loaders';

const app = express();

loaders(app);
void connectMongoDB();

app.get('/', (req, res) => {
  res.status(200).json({ result: 'success' });
});
app.use('/api', index);

app.use(invalidUrlHandler);
app.use(errorHandler);

export default app;
