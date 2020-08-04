import type { DBClient } from "../deps.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "POSTGRES_HOST"],
    ["user", "POSTGRES_USER"],
    ["password", "POSTGRES_PASSWORD"],
    ["database", "POSTGRES_DB"]
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

async function createBlogService(Client: typeof DBClient) {
  const client = new Client(createClientOpts())

  await client.connect();

  return {
    async getPosts(): Promise<Post[]> {
      const { rows } = await client.query(`
        select
          p.id,
          p.title,
          p.contents,
          json_object_agg(a) as author,
          json_agg(json_object_agg(t)) as tags

        from post p
        join author a
        on p.author_id = a.id
        join post_tags pt
        on p.id = pt.post_id
        join tag t
        on t.id = pt.tag_id
        group by p.id;
      `);

      return rows;
    },
  };
}

export default createBlogService;
