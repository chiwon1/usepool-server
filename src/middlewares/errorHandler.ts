import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  res.status(err.status || 500).json({ error: err.message });
};

export default errorHandler;
