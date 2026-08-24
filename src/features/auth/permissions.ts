import { db } from "@/lib/db";

// Static fallback mapping for default roles & permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  "Super Admin": ["*"],
  "Admin": [
    "users:view", "users:manage",
    "course:view", "course:create", "course:update", "course:delete", "course:publish", "course:approve",
    "billing:view", "billing:refund",
    "cms:manage", "support:manage", "licensing:manage"
  ],
  "Instructor": [
    "course:view", "course:create", "course:update", "course:publish",
    "billing:view", "analytics:view"
  ],
  "Assistant Instructor": [
    "course:view", "course:update", "analytics:view"
  ],
  "Mentor": [
    "mentorship:manage", "mentorship:view"
  ],
  "Student": [
    "course:view", "enrollment:view"
  ],
  "Organization Admin": [
    "org:view", "org:manage", "org:billing", "org:users:manage"
  ],
  "Organization Manager": [
    "org:view", "org:users:view", "org:analytics:view"
  ],
  "Support Staff": [
    "users:view", "support:manage"
  ],
  "Content Manager": [
    "cms:manage"
  ],
  "Finance Manager": [
    "billing:view", "billing:refund", "billing:payout"
  ]
};

/**
 * Checks if a role has a specific permission.
 * Supports wildcard "*" permissions for Super Admins.
 */
export function roleHasPermission(roleName: string, permission: string): boolean {
  const permissions = DEFAULT_ROLE_PERMISSIONS[roleName];
  if (!permissions) return false;
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}

/**
 * Verifies permission by querying the database RBAC models
 */
export async function verifyUserPermission(userId: string, permissionName: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!user || !user.isActive) return false;
  
  // Super Admin bypass
  if (user.role.name === "Super Admin") return true;

  // Static fallback check
  const hasStaticPermission = roleHasPermission(user.role.name, permissionName);
  if (hasStaticPermission) return true;

  // DB check
  return user.role.permissions.some(
    (rp) => rp.permission.name === permissionName || rp.permission.name === "*"
  );
}
