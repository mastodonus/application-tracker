import jwt from 'jsonwebtoken';
import { variables } from '../utilities/variables.js'

export function requireAuth(req, res, next) {
  const token = req.cookies.apptrack_auth;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, variables.jwt.secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}