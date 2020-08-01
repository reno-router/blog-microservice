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
  name: string;
}

interface Tag {
  id: string;
  name: string;
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
        select
          p.id,
          p.title,
          p.contents,
          a.display_name as author,
          GROUP_CONCAT(t.display_name) as tags

        from post p
        join author a
        on p.author_id = a.id
        join post_tags pt
        on p.id = pt.post_id
        join tag t
        on t.id = pt.tag_id
        group by p.id;
    `),
  };
}

export default createBlogService;
