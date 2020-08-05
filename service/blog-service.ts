import type { DBClient } from "../deps.ts";
import { GET_POSTS_QUERY, GET_POST_QUERY } from "./queries.ts";

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
      const res = await client.query(GET_POSTS_QUERY);
      return res.rowsOfObjects() as Post[];
    },

    async getPost(id: string): Promise<Post> {
      const res = await client.query({
        text: GET_POST_QUERY,
        args: [id],
      });

      const [post] = res.rowsOfObjects();

      return post as Post;
    }
  };
}

export default createBlogService;
