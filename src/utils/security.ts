import { AuthUser, AuthSession, SecuritySettings, LoginAttempt } from '../types';

// Security configuration
export const defaultSecuritySettings: SecuritySettings = {
  sessionTimeout: 60, // 1 hour
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireStrongPassword: true,
  enableTwoFactor: false,
  allowedDomains: [], // Empty means all domains allowed
};

// Simple password hashing (in production, use bcrypt or similar)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'blog-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Generate secure token
export const generateToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < defaultSecuritySettings.passwordMinLength) {
    errors.push(`Le mot de passe doit contenir au moins ${defaultSecuritySettings.passwordMinLength} caractères`);
  }
  
  if (defaultSecuritySettings.requireStrongPassword) {
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if domain is allowed
export const isDomainAllowed = (email: string, allowedDomains: string[]): boolean => {
  if (allowedDomains.length === 0) return true;
  
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.some(allowed => domain === allowed.toLowerCase());
};

// Session management
export const createSession = (user: AuthUser): AuthSession => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + defaultSecuritySettings.sessionTimeout * 60 * 1000);
  
  return {
    user,
    token: generateToken(),
    expiresAt: expiresAt.toISOString(),
    lastActivity: now.toISOString(),
  };
};

export const isSessionValid = (session: AuthSession): boolean => {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  return now < expiresAt;
};

export const refreshSession = (session: AuthSession): AuthSession => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + defaultSecuritySettings.sessionTimeout * 60 * 1000);
  
  return {
    ...session,
    expiresAt: expiresAt.toISOString(),
    lastActivity: now.toISOString(),
  };
};

// Login attempts tracking
export const trackLoginAttempt = (
  attempts: LoginAttempt[],
  email: string,
  success: boolean
): LoginAttempt[] => {
  const now = new Date();
  const newAttempt: LoginAttempt = {
    email: email.toLowerCase(),
    timestamp: now.toISOString(),
    success,
  };
  
  // Clean old attempts (older than 1 hour)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const recentAttempts = attempts.filter(
    attempt => new Date(attempt.timestamp) > oneHourAgo
  );
  
  return [...recentAttempts, newAttempt];
};

export const isAccountLocked = (attempts: LoginAttempt[], email: string): boolean => {
  const userAttempts = attempts.filter(
    attempt => attempt.email === email.toLowerCase() && !attempt.success
  );
  
  return userAttempts.length >= defaultSecuritySettings.maxLoginAttempts;
};

// Data sanitization for XSS prevention
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Input validation
export const validateInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') return '';
  return sanitizeHtml(input.slice(0, maxLength).trim());
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return generateToken();
};

// Secure data storage (encrypt before localStorage)
export const encryptData = async (data: any): Promise<string> => {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonString);
  
  // Simple encryption using Web Crypto API
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode('blog-encryption-key-2024-secure'),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
};

export const decryptData = async (encryptedString: string): Promise<any> => {
  try {
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedString).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('blog-encryption-key-2024-secure'),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Permission checking
export const hasPermission = (user: AuthUser | null, permission: keyof AuthUser['permissions']): boolean => {
  if (!user) return false;
  return user.permissions[permission] === true;
};

// Role hierarchy checking
export const hasRoleOrHigher = (user: AuthUser | null, requiredRole: string): boolean => {
  if (!user) return false;
  
  const roleHierarchy = ['contributor', 'author', 'editor', 'admin'];
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
};