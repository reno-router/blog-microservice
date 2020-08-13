import { DBPool, DBPoolClient } from "../deps.ts";

export function buildQuery(text: string, ...args: (string | string[])[]) {
  return {
    text,
    args,
  };
}

function createDbService(dbPool: Pick<DBPool, "connect">) {
  return {
    async query(query: string, ...args: (string | string[])[]) {
      const client = await dbPool.connect();

      try {
        return await client.query(buildQuery(query, ...args));
      } finally {
        client.release();
      }
    },

    async tx(cb: (c: Pick<DBPoolClient, "query">) => Promise<void>) {
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
