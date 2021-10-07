import dotenv from 'dotenv';
dotenv.config();
import express, { ErrorRequestHandler } from 'express';
import rides from './routes/rides';
import connectMongoDB from './config/db';
import indexRouter from './routes';
import usersRouter from './routes/users';
import login from './routes/login';
import logout from './routes/logout';
import auth from './middlewares/auth';
import invalidUrlHandler from './middlewares/invalidUrlHandler';
import errorHandler from './middlewares/errorHandler';
import loaders from './loaders';

const app = express();
loaders(app);

void connectMongoDB();

app.use('/login', login);
app.use('/logout', auth, logout);
app.use('/users', usersRouter);
app.use('/rides', rides);
app.use('/', indexRouter);

app.use(invalidUrlHandler);

app.use(errorHandler);

export default app;
