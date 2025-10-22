import { useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthSession, LoginCredentials, LoginAttempt } from '../types';
import { User } from '../types';
import { useUsers } from './useUsers';
import {
  hashPassword,
  verifyPassword,
  createSession,
  isSessionValid,
  refreshSession,
  trackLoginAttempt,
  isAccountLocked,
  validateEmail,
  validatePasswordStrength,
  encryptData,
  decryptData,
} from '../utils/security';

const SESSION_KEY = 'blog-auth-session';
const LOGIN_ATTEMPTS_KEY = 'blog-login-attempts';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  
  const { users, updateUser } = useUsers();

  // Load session on mount
  useEffect(() => {
    loadSession();
    loadLoginAttempts();
  }, []);

  // Auto-refresh session
  useEffect(() => {
    if (session && isSessionValid(session)) {
      const interval = setInterval(() => {
        const refreshedSession = refreshSession(session);
        setSession(refreshedSession);
        saveSession(refreshedSession);
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [session]);

  const loadSession = async () => {
    try {
      const { storage } = await import('../utils/storage');
      const encryptedSession = await storage.getItem<string>(SESSION_KEY);
      if (encryptedSession) {
        const sessionData = await decryptData(encryptedSession);
        if (sessionData && isSessionValid(sessionData)) {
          setSession(sessionData);
          setCurrentUser(sessionData.user);
        } else {
          clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async (sessionData: AuthSession) => {
    try {
      const { storage } = await import('../utils/storage');
      const encryptedSession = await encryptData(sessionData);
      await storage.setItem(SESSION_KEY, encryptedSession);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const clearSession = async () => {
    try {
      const { storage } = await import('../utils/storage');
      await storage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session from storage:', error);
    }
    setSession(null);
    setCurrentUser(null);
  };

  const loadLoginAttempts = async () => {
    try {
      const { storage } = await import('../utils/storage');
      const attempts = await storage.getItem<LoginAttempt[]>(LOGIN_ATTEMPTS_KEY);
      if (attempts) {
        setLoginAttempts(attempts);
      }
    } catch (error) {
      console.error('Failed to load login attempts:', error);
    }
  };

  const saveLoginAttempts = (attempts: LoginAttempt[]) => {
    try {
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
      setLoginAttempts(attempts);
    } catch (error) {
      console.error('Failed to save login attempts:', error);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<{
    success: boolean;
    error?: string;
    user?: AuthUser;
  }> => {
    const { email, password } = credentials;

    // Validate input
    if (!validateEmail(email)) {
      return { success: false, error: 'Email invalide' };
    }

    if (!password) {
      return { success: false, error: 'Mot de passe requis' };
    }

    // Check if account is locked
    if (isAccountLocked(loginAttempts, email)) {
      return { 
        success: false, 
        error: 'Compte temporairement verrouillé. Trop de tentatives de connexion.' 
      };
    }

    try {
      // Find user
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Track failed attempt
        const updatedAttempts = trackLoginAttempt(loginAttempts, email, false);
        saveLoginAttempts(updatedAttempts);
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: 'Compte désactivé' };
      }

      // For demo purposes, we'll use a simple password system
      // In production, you'd have hashed passwords stored
      const defaultPasswords: Record<string, string> = {
        'admin@entrepreneur-chevronne.com': 'Admin123!',
        'marie.dupont@example.com': 'Marie123!',
        'jean.martin@example.com': 'Jean123!',
        'sophie.bernard@example.com': 'Sophie123!',
        'pierre.leroy@example.com': 'Pierre123!',
      };

      const expectedPassword = defaultPasswords[user.email];
      const isPasswordValid = expectedPassword ? password === expectedPassword : false;

      if (!isPasswordValid) {
        // Track failed attempt
        const updatedAttempts = trackLoginAttempt(loginAttempts, email, false);
        saveLoginAttempts(updatedAttempts);
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Create auth user
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
        permissions: user.permissions,
      };

      // Create session
      const newSession = createSession(authUser);
      
      // Update last login
      updateUser(user.id, { lastLogin: new Date().toISOString() });

      // Track successful attempt
      const updatedAttempts = trackLoginAttempt(loginAttempts, email, true);
      saveLoginAttempts(updatedAttempts);

      // Save session
      await saveSession(newSession);
      setSession(newSession);
      setCurrentUser(authUser);

      return { success: true, user: authUser };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  }, [users, loginAttempts, updateUser]);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'Non connecté' };
    }

    // Validate new password
    const validation = validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    try {
      // In a real app, you'd verify the current password and update the hash
      // For now, we'll just validate the format
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors du changement de mot de passe' };
    }
  }, [currentUser]);

  const hasPermission = useCallback((permission: keyof AuthUser['permissions']): boolean => {
    return currentUser?.permissions[permission] === true;
  }, [currentUser]);

  const hasRole = useCallback((role: string): boolean => {
    return currentUser?.role === role;
  }, [currentUser]);

  const hasRoleOrHigher = useCallback((role: string): boolean => {
    if (!currentUser) return false;
    
    const roleHierarchy = ['contributor', 'author', 'editor', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(currentUser.role);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    
    return userRoleIndex >= requiredRoleIndex;
  }, [currentUser]);

  const isAuthenticated = !!currentUser && !!session && isSessionValid(session);

  return {
    currentUser,
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    hasPermission,
    hasRole,
    hasRoleOrHigher,
    loginAttempts: loginAttempts.length,
    isAccountLocked: (email: string) => isAccountLocked(loginAttempts, email),
  };
}