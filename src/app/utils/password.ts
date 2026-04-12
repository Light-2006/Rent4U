const encoder = new TextEncoder();

function arrayBufferToBase64(buffer: ArrayBuffer) {
  // Node.js Buffer fallback
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(buffer).toString('base64');
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}

function base64ToArrayBuffer(b64: string) {
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(b64, 'base64');
  }
  const binary = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

const subtle = (globalThis as any).crypto?.subtle ?? (globalThis as any).crypto?.webcrypto?.subtle;
if (!subtle) {
  // If subtle is not available in the current environment, retain functions but they'll throw at runtime.
}

export async function hashPassword(password: string, iterations = 120000): Promise<string> {
  if (!password) throw new Error('Password empty');
  if (!subtle) throw new Error('Web Crypto API not available');
  const salt = (globalThis as any).crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const derivedBits = await subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256);
  const saltB64 = arrayBufferToBase64(salt.buffer);
  const hashB64 = arrayBufferToBase64(derivedBits);
  return `pbkdf2$${iterations}$${saltB64}$${hashB64}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  if (!subtle) throw new Error('Web Crypto API not available');
  if (stored.startsWith('pbkdf2$')) {
    const parts = stored.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10) || 120000;
    const saltB64 = parts[2];
    const expectedB64 = parts[3];
    const saltBuf = base64ToArrayBuffer(saltB64);
    const keyMaterial = await subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
    const derivedBits = await subtle.deriveBits({ name: 'PBKDF2', salt: new Uint8Array(saltBuf), iterations, hash: 'SHA-256' }, keyMaterial, 256);
    const derivedB64 = arrayBufferToBase64(derivedBits);
    return derivedB64 === expectedB64;
  }
  // fallback for legacy plaintext passwords
  return password === stored;
}

export default {
  hashPassword,
  verifyPassword,
};
