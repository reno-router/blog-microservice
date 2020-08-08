import { DBPool, DBPoolClient } from "../deps.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "POSTGRES_HOST"],
    ["user", "POSTGRES_USER"],
    ["password", "POSTGRES_PASSWORD"],
    ["database", "POSTGRES_DB"],
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

function getPoolConnectionCount() {
  return Number.parseInt(Deno.env.get("POSTGRES_POOL_CONNECTIONS") || "1", 10);
}

export function buildQuery(text: string, ...args: (string | string[])[]) {
  return {
    text,
    args,
  };
}

function createDbService(Pool: typeof DBPool) {
  const dbPool = new Pool(createClientOpts(), getPoolConnectionCount());

  return {
    async query(query: string, ...args: (string | string[])[]) {
      const client = await dbPool.connect();

      try {
        return await client.query(buildQuery(query, ...args));
      } finally {
        client.release();
      }
    },

    async tx(cb: (c: DBPoolClient) => Promise<void>) {
      const client = await dbPool.connect();

      try {
        await client.query("begin;");
        await cb(client);
        await client.query("commit;");
      } catch (e) {
        await client.query("rollback;");
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

export type DbService = ReturnType<typeof createDbService>;
export default createDbService;
