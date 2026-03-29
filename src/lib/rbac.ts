import type { UserSession } from "@/lib/types";

export type AppRole = UserSession["role"];

export const adminOnlyAdminPaths = [
  "/admin/automations",
  "/admin/finance",
  "/admin/site",
  "/admin/logs",
  "/admin/team",
] as const;

export function isAdminOnlyAdminPath(pathname: string) {
  return adminOnlyAdminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function hasRequiredRole(role: AppRole, allowedRoles: AppRole[]) {
  return allowedRoles.includes(role);
}
