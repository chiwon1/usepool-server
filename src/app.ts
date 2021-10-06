import dotenv from 'dotenv';
dotenv.config();
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';

import rides from './routes/rides';
import connectMongoDB from './config/db';

import indexRouter from './routes';
import usersRouter from './routes/users';
import login from './routes/login';
import cors from 'cors';

const app = express();

app.use(helmet());
void connectMongoDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/users', usersRouter);
app.use('/rides', rides);
app.use('/', indexRouter);

// catch 404 and forward to error handler
const invalidUrlHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};

app.use(invalidUrlHandler);

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  res.status(err.status || 500);
};

app.use(errorHandler);

export default app;
