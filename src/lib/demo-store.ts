import { createDemoSnapshot } from "@/lib/demo-data";

type DemoStore = ReturnType<typeof createDemoSnapshot>;

declare global {
  // eslint-disable-next-line no-var
  var __demoStore: DemoStore | undefined;
}

function buildStore() {
  return createDemoSnapshot();
}

export const demoStore = global.__demoStore ?? buildStore();

if (process.env.NODE_ENV !== "production") {
  global.__demoStore = demoStore;
}

export function nextDemoId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

