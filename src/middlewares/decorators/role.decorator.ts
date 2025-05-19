import { setRoles } from '../guards/roles.guard';

// Function to assign roles to a route
export function Roles(...roles: number[]) {
  return (routePath: string, method: string) => {
    setRoles(routePath, method, roles);
  };
}