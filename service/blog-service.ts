import type { MySQLClient } from "../deps.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "MYSQL_HOST"],
    ["username", "MYSQL_USER"],
    ["password", "MYSQL_PASSWORD"],
    ["db", "MYSQL_DB_NAME"]
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

async function createBlogService(Client: typeof MySQLClient) {
  const client = await new Client().connect(createClientOpts());

  return {
    getPosts: (): Promise<{ result: number }> =>
      client.query(`
        select 1 + 1 as result
      `),
  };
}

export default createBlogService;
