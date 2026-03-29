import { UserRole } from "@prisma/client";

import { demoAdminUser } from "@/lib/demo-data";
import { prisma, withFallback } from "@/lib/prisma";

type Assignee = {
  id?: string;
  name: string;
  email: string;
};

export async function getDefaultBackofficeAssignee(): Promise<Assignee> {
  return withFallback(
    async () => {
      if (!prisma) {
        return {
          id: demoAdminUser.id,
          name: demoAdminUser.name,
          email: demoAdminUser.email,
        };
      }

      const preferred = await prisma.user.findFirst({
        where: {
          email: demoAdminUser.email,
          role: { in: [UserRole.ADMIN, UserRole.ACCOUNT_MANAGER] },
        },
      });

      if (preferred) {
        return {
          id: preferred.id,
          name: preferred.name,
          email: preferred.email,
        };
      }

      const fallbackUser = await prisma.user.findFirst({
        where: {
          role: { in: [UserRole.ADMIN, UserRole.ACCOUNT_MANAGER] },
        },
        orderBy: { createdAt: "asc" },
      });

      return {
        id: fallbackUser?.id,
        name: fallbackUser?.name ?? demoAdminUser.name,
        email: fallbackUser?.email ?? demoAdminUser.email,
      };
    },
    () => ({
      id: demoAdminUser.id,
      name: demoAdminUser.name,
      email: demoAdminUser.email,
    }),
  );
}
