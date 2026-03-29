import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

import { demoAdminUser, demoAccountManagerUser } from "@/lib/demo-data";
import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { UserRecord, UserSession } from "@/lib/types";

type UserInput = {
  name: string;
  email: string;
  role: UserSession["role"];
  password: string;
};

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listUsers(): Promise<UserRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.users;
      }

      const users = await prisma.user.findMany({
        orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      });

      return users.map(mapUser);
    },
    () => demoStore.users,
  );
}

export async function createUser(input: UserInput): Promise<UserRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          passwordHash,
        },
      });

      return mapUser(user);
    },
    () => {
      const user = {
        id: nextDemoId("user"),
        name: input.name,
        email: input.email,
        role: input.role,
        createdAt: new Date().toISOString(),
      } satisfies UserRecord;

      demoStore.users.unshift(user);
      return user;
    },
  );
}

export async function updateUserRole(id: string, role: UserSession["role"]) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role },
      });

      return mapUser(user);
    },
    () => {
      const user = demoStore.users.find((item) => item.id === id);
      if (user) {
        user.role = role;
      }
      return user ?? null;
    },
  );
}

export async function resetUserPassword(id: string, password: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id },
        data: { passwordHash },
      });
      return true;
    },
    () => {
      return Boolean(demoStore.users.find((item) => item.id === id));
    },
  );
}

export function getFallbackTeamDefaults() {
  return {
    admin: demoAdminUser,
    accountManager: demoAccountManagerUser,
  };
}
