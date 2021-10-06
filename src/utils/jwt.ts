import jwt from 'jsonwebtoken';

export const encode = (
  payload: string | Buffer | Record<string, unknown>,
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '7d' });
};

export const decode = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
};
