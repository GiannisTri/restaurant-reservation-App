import { decode as base64_decode } from 'base-64';
// token decoder
export function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = base64_decode(base64);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}