import type { MySQLClient } from "../deps.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "MYSQL_HOST"],
    ["username", "MYSQL_USER"],
    ["password", "MYSQL_PASSWORD"],
    ["db", "MYSQL_DATABASE"]
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

interface Author {
  id: string;
  displayName: string;
}

interface Tag {
  id: string;
  displayName: string;
}

interface Post {
  id: string,
  author: Author;
  tags: Tag[];
  contents: string;
}

async function createBlogService(Client: typeof MySQLClient) {
  const client = await new Client().connect(createClientOpts());

  return {
    getPosts: (): Promise<Post[]> =>
      client.query(`
        select id, author_id, contents from post
      `),
  };
}

export default createBlogService;
