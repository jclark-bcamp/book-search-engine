// import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// Update the auth middleware function to work with the GraphQL API.
export const authenticateToken = (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authHeader.split(' ')[1];
  console.log(token);
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded; 
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
