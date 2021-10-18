import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  res.status(err.status || 500);
};

export default errorHandler;
