import { useCallback } from 'react';
import { User, UserRole, UserInvitation } from '../types';
import { defaultUsers, rolePermissions } from '../data/users';
import { useLocalStorage } from './useLocalStorage';

export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>('blog-users', defaultUsers);
  const [invitations, setInvitations] = useLocalStorage<UserInvitation[]>('blog-invitations', []);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt' | 'articlesCount' | 'permissions'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      articlesCount: 0,
      permissions: rolePermissions[userData.role],
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, ...updates };
        // Update permissions if role changed
        if (updates.role && updates.role !== user.role) {
          updatedUser.permissions = rolePermissions[updates.role];
        }
        return updatedUser;
      }
      return user;
    }));
  }, [setUsers]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, [setUsers]);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  }, [setUsers]);

  const sendInvitation = useCallback((email: string, role: UserRole, invitedBy: string) => {
    const invitation: UserInvitation = {
      id: Date.now().toString(),
      email,
      role,
      invitedBy,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      isAccepted: false,
    };

    setInvitations(prev => [...prev, invitation]);
    return invitation;
  }, [setInvitations]);

  const acceptInvitation = useCallback((invitationId: string, userData: Omit<User, 'id' | 'email' | 'role' | 'createdAt' | 'articlesCount' | 'permissions'>) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation || invitation.isAccepted) return null;

    const newUser = addUser({
      ...userData,
      email: invitation.email,
      role: invitation.role,
    });

    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, isAccepted: true, acceptedAt: new Date().toISOString() }
        : inv
    ));

    return newUser;
  }, [invitations, addUser, setInvitations]);

  const deleteInvitation = useCallback((invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  }, [setInvitations]);

  const getUsersByRole = useCallback((role: UserRole) => {
    return users.filter(user => user.role === role && user.isActive);
  }, [users]);

  const getActiveUsers = useCallback(() => {
    return users.filter(user => user.isActive);
  }, [users]);

  const getUserStats = useCallback(() => {
    const total = users.length;
    const active = users.filter(user => user.isActive).length;
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      total,
      active,
      inactive: total - active,
      byRole,
      pendingInvitations: invitations.filter(inv => !inv.isAccepted).length,
    };
  }, [users, invitations]);

  return {
    users,
    invitations,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    sendInvitation,
    acceptInvitation,
    deleteInvitation,
    getUsersByRole,
    getActiveUsers,
    getUserStats,
  };
}