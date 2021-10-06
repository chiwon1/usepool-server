import { IUserDocument } from '../models/User';

export interface ICookies {
  x_auth?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      token?: string;
      cookies?: ICookies;
    }
  }
}
