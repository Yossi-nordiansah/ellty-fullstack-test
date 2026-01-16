import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

if (!process.env.JWT_SECRET) {
  console.warn('[AUTH] Warning: JWT_SECRET environment variable is missing. Authentication might be inconsistent.');
}

export function signJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('[AUTH] JWT Verification failed:', error.message);
    return null;
  }
}

export function getUserFromRequest(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyJWT(token);
}
