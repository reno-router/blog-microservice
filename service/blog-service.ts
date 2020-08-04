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
  // TODO: USE POOL
  const client = new Client(createClientOpts());

  await client.connect();

  return {
    async getPosts(): Promise<Post[]> {
      const r = await client.query(`
        select
          p.id,
          p.title,
          p.contents,
          json_build_object('id', a.id, 'name', a.display_name) as author,
          json_agg(json_build_object('id', t.id, 'name', t.display_name)) as tags

        from blogs.post p
        join blogs.author a
        on p.author_id = a.id
        join blogs.post_tags pt
        on p.id = pt.post_id
        join blogs.tag t
        on t.id = pt.tag_id
        group by p.id, a.id;
      `);

      return r.rowsOfObjects() as Post[];
    },
  };
}

export default createBlogService;
