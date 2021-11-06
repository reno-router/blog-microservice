import { DBPool, DBPoolClient } from "../deps.ts";

export function buildQuery(text: string, ...args: (string | string[])[]) {
  return {
    text,
    args,
  };
}

function createDbService(dbPool: Pick<DBPool, "connect">) {
  return {
    async query<TItem>(query: string, ...args: (string | string[])[]) {
      const client = await dbPool.connect();

      try {
        return (await client.queryObject<TItem>(buildQuery(query, ...args)));
      } finally {
        client.release();
      }
    },

    async tx(cb: (c: Pick<DBPoolClient, "queryObject">) => Promise<void>) {
      const client = await dbPool.connect();

      try {
        await client.queryObject("begin;");
        await cb(client);
        await client.queryObject("commit;");
      } catch (e) {
        await client.queryObject("rollback;");
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

export type DbService = ReturnType<typeof createDbService>;
export default createDbService;
