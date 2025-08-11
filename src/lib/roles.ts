// User role utilities for E-Commerce App

export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN'

export const UserRoles = {
  USER: 'USER' as const,
  ADMIN: 'ADMIN' as const,
  SUPERADMIN: 'SUPERADMIN' as const,
} as const

export interface RolePermissions {
  canViewAllUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canManageProducts: boolean
  canManageCategories: boolean
  canManageOrders: boolean
  canViewAnalytics: boolean
  canManageAdmins: boolean
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case 'SUPERADMIN':
      return {
        canViewAllUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canManageProducts: true,
        canManageCategories: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageAdmins: true,
      }

    case 'ADMIN':
      return {
        canViewAllUsers: true,
        canEditUsers: false,
        canDeleteUsers: false,
        canManageProducts: true,
        canManageCategories: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageAdmins: false,
      }

    case 'USER':
    default:
      return {
        canViewAllUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canManageProducts: false,
        canManageCategories: false,
        canManageOrders: false,
        canViewAnalytics: false,
        canManageAdmins: false,
      }
  }
}

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'SUPERADMIN':
      return '#DC2626' // Red
    case 'ADMIN':
      return '#F59E0B' // Orange
    case 'USER':
    default:
      return '#10B981' // Green
  }
}

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'SUPERADMIN':
      return 'Super Admin'
    case 'ADMIN':
      return 'Admin'
    case 'USER':
    default:
      return 'User'
  }
}

export const canAccessAdminFeatures = (role: UserRole): boolean => {
  return role === 'ADMIN' || role === 'SUPERADMIN'
}

export const canManageOtherAdmins = (role: UserRole): boolean => {
  return role === 'SUPERADMIN'
}
