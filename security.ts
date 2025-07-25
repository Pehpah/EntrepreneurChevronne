// =============================================================================
// SECURITY UTILITIES - Utilitaires de sécurité
// =============================================================================

import crypto from 'crypto';

// =============================================================================
// Types de sécurité
// =============================================================================

export interface SecurityConfig {
  saltRounds: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  maxLoginAttempts: number;
  lockoutDuration: number; // en minutes
  passwordMinLength: number;
  sessionTimeout: number; // en minutes
}

export interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
}

// =============================================================================
// Configuration par défaut
// =============================================================================

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  saltRounds: 12,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: '24h',
  maxLoginAttempts: 5,
  lockoutDuration: 15, // 15 minutes
  passwordMinLength: 8,
  sessionTimeout: 30, // 30 minutes
};

// =============================================================================
// Validation des mots de passe
// =============================================================================

/**
 * Valide la force d'un mot de passe
 * @param password - Mot de passe à valider
 * @returns Objet avec la validité et les erreurs
 */
export const validatePassword = (password: string) => {
  const errors: string[] = [];
  
  if (password.length < DEFAULT_SECURITY_CONFIG.passwordMinLength) {
    errors.push(`Le mot de passe doit contenir au moins ${DEFAULT_SECURITY_CONFIG.passwordMinLength} caractères`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calcule la force d'un mot de passe (0-100)
 * @param password - Mot de passe à évaluer
 * @returns Score de force (0-100)
 */
export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  
  // Longueur
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  
  // Complexité
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Diversité des caractères
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 10;
  
  return Math.min(score, 100);
};

// =============================================================================
// Hachage et vérification
// =============================================================================

/**
 * Hache un mot de passe avec bcrypt
 * @param password - Mot de passe en clair
 * @returns Promise du hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, DEFAULT_SECURITY_CONFIG.saltRounds);
};

/**
 * Vérifie un mot de passe contre son hash
 * @param password - Mot de passe en clair
 * @param hash - Hash stocké
 * @returns Promise boolean
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
};

// =============================================================================
// Génération de tokens sécurisés
// =============================================================================

/**
 * Génère un token aléatoire sécurisé
 * @param length - Longueur du token (défaut: 32)
 * @returns Token hexadécimal
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Génère un code numérique aléatoire
 * @param length - Longueur du code (défaut: 6)
 * @returns Code numérique
 */
export const generateNumericCode = (length: number = 6): string => {
  const digits = '0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return result;
};

// =============================================================================
// Sanitisation et validation des entrées
// =============================================================================

/**
 * Échappe les caractères HTML dangereux
 * @param input - Chaîne à échapper
 * @returns Chaîne échappée
 */
export const escapeHtml = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (s) => map[s]);
};

/**
 * Valide un email
 * @param email - Email à valider
 * @returns Boolean de validité
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Nettoie et valide une URL
 * @param url - URL à valider
 * @returns URL nettoyée ou null si invalide
 */
export const sanitizeUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    
    // Seuls les protocoles sûrs sont autorisés
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
};

// =============================================================================
// Protection contre les attaques par force brute
// =============================================================================

const loginAttempts = new Map<string, LoginAttempt>();

/**
 * Enregistre une tentative de connexion échouée
 * @param email - Email de l'utilisateur
 */
export const recordFailedLogin = (email: string): void => {
  const now = new Date();
  const attempt = loginAttempts.get(email);
  
  if (attempt) {
    attempt.attempts++;
    attempt.lastAttempt = now;
    
    if (attempt.attempts >= DEFAULT_SECURITY_CONFIG.maxLoginAttempts) {
      attempt.lockedUntil = new Date(now.getTime() + DEFAULT_SECURITY_CONFIG.lockoutDuration * 60000);
    }
  } else {
    loginAttempts.set(email, {
      email,
      attempts: 1,
      lastAttempt: now,
    });
  }
};

/**
 * Vérifie si un compte est verrouillé
 * @param email - Email de l'utilisateur
 * @returns Boolean indiquant si le compte est verrouillé
 */
export const isAccountLocked = (email: string): boolean => {
  const attempt = loginAttempts.get(email);
  
  if (!attempt || !attempt.lockedUntil) {
    return false;
  }
  
  if (new Date() > attempt.lockedUntil) {
    // Le verrouillage a expiré, nettoyer
    loginAttempts.delete(email);
    return false;
  }
  
  return true;
};

/**
 * Réinitialise les tentatives de connexion pour un email
 * @param email - Email de l'utilisateur
 */
export const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
};

// =============================================================================
// Headers de sécurité
// =============================================================================

/**
 * Génère les headers de sécurité recommandés
 * @param domain - Domaine de l'application
 * @returns Objet des headers de sécurité
 */
export const getSecurityHeaders = (domain?: string): SecurityHeaders => {
  return {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://api.${domain || 'localhost'};
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim(),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
};

// =============================================================================
// Utilitaires de session
// =============================================================================

/**
 * Génère un ID de session sécurisé
 * @returns ID de session
 */
export const generateSessionId = (): string => {
  return generateSecureToken(64);
};

/**
 * Vérifie si une session a expiré
 * @param lastActivity - Dernière activité de la session
 * @param timeoutMinutes - Timeout en minutes (optionnel)
 * @returns Boolean indiquant si la session a expiré
 */
export const isSessionExpired = (
  lastActivity: Date,
  timeoutMinutes: number = DEFAULT_SECURITY_CONFIG.sessionTimeout
): boolean => {
  const now = new Date();
  const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
  return diffMinutes > timeoutMinutes;
};

// =============================================================================
// Rate limiting
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Vérifie et applique le rate limiting
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @param maxRequests - Nombre maximum de requêtes
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns Boolean indiquant si la requête est autorisée
 */
export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
};

// =============================================================================
// Nettoyage périodique
// =============================================================================

/**
 * Nettoie les données expirées (à appeler périodiquement)
 */
export const cleanupExpiredData = (): void => {
  const now = new Date();
  
  // Nettoyer les tentatives de connexion expirées
  for (const [email, attempt] of loginAttempts.entries()) {
    if (attempt.lockedUntil && now > attempt.lockedUntil) {
      loginAttempts.delete(email);
    }
  }
  
  // Nettoyer les entrées de rate limiting expirées
  const nowMs = Date.now();
  for (const [identifier, entry] of rateLimitMap.entries()) {
    if (nowMs > entry.resetTime) {
      rateLimitMap.delete(identifier);
    }
  }
};

// =============================================================================
// Export par défaut
// =============================================================================

export default {
  DEFAULT_SECURITY_CONFIG,
  validatePassword,
  calculatePasswordStrength,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  generateNumericCode,
  escapeHtml,
  isValidEmail,
  sanitizeUrl,
  recordFailedLogin,
  isAccountLocked,
  resetLoginAttempts,
  getSecurityHeaders,
  generateSessionId,
  isSessionExpired,
  checkRateLimit,
  cleanupExpiredData,
};