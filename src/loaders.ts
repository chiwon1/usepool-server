import helmet from 'helmet';
import cors from 'cors';
import logger from 'morgan';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

const loaders = (app: Express) => {
  app.use(helmet());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
};

export default loaders;
