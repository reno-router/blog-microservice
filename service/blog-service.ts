import type { MySQLClient } from "../deps.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "MYSQL_HOST"],
    ["username", "MYSQL_USER"],
    ["password", "MYSQL_PASSWORD"],
    ["db", "MYSQL_DATABASE"]
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

async function createBlogService(Client: typeof MySQLClient) {
  const client = await new Client().connect(createClientOpts());

  return {
    getPosts: (): Promise<{ contents: string }[]> =>
      client.query(`
        select id, author_id, contents from post
      `),
  };
}

export default createBlogService;
