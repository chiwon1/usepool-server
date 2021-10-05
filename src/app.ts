import dotenv from 'dotenv';
dotenv.config();
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';

import indexRouter from './routes';
import usersRouter from './routes/users';
import connectMongoDB from './config/db';

const app = express();

app.use(helmet());
void connectMongoDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
