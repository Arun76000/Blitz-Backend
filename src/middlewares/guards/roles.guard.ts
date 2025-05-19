import { Request, Response, NextFunction } from 'express';
import * as constants from '../../core/configuration/constants-variables';

// Extend Express Request to include roleLevel
interface AuthRequest extends Request {
  roleLevel?: number;
}

// Store route metadata (simulating NestJS Reflector)
const routeMetadata = new Map<string, number[]>();

// Middleware to check user roles
export function rolesGuard(req: AuthRequest, res: Response, next: NextFunction): void {
  // Get required roles from metadata (set by setRoles)
  const requiredRoleLevels = routeMetadata.get(req.route?.path + req.method);

  // If no roles are required, allow access
  if (!requiredRoleLevels || requiredRoleLevels.length === 0) {
    return next();
  }

  // Get user role level from request (assumed to be set by authentication middleware)
  const userRoleLevel = req.roleLevel;

  if (!userRoleLevel) {
    res.status(403).json({
      message: 'You Are Not Authorized!',
    });
    return;
  }

  // Admin role (level 1) has full access
  if (userRoleLevel === 1) {
    return next();
  }

  // Check if user role level is in required roles
  const isValid = requiredRoleLevels.includes(userRoleLevel);
  if (isValid) {
    return next();
  }

  // Deny access if role is not valid
  res.status(403).json({
    message: 'You Are Not Authorized!',
  });
}

// Function to set roles metadata for a route
export function setRoles(routePath: string, method: string, roles: number[]): void {
  routeMetadata.set(routePath + method, roles);
}