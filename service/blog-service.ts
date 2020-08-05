import { DBClient, uuidv4 } from "../deps.ts";
import { GET_POSTS_QUERY, GET_POST_QUERY, ADD_POST_QUERY } from "./queries.ts";
import { PostPayload } from "./routes.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "POSTGRES_HOST"],
    ["user", "POSTGRES_USER"],
    ["password", "POSTGRES_PASSWORD"],
    ["database", "POSTGRES_DB"],
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

interface PostMetadata {
  id: string;
  author: Author;
  tags: Tag[];
  title: string;
}

interface Post extends PostMetadata {
  contents: string;
}

async function createBlogService(Client: typeof DBClient) {
  // TODO: USE POOL
  const client = new Client(createClientOpts());

  await client.connect();

  return {
    async getPosts(): Promise<PostMetadata[]> {
      const res = await client.query(GET_POSTS_QUERY);
      return res.rowsOfObjects() as PostMetadata[];
    },

    async getPost(id: string): Promise<Post> {
      const res = await client.query({
        text: GET_POST_QUERY,
        args: [id],
      });

      const [post] = res.rowsOfObjects();

      return post as Post;
    },

    async addPost(post: PostPayload): Promise<void> {
      const postId = uuidv4.generate();
      const [addPostQuery, addTagsQuery] = ADD_POST_QUERY;

      const tx: [string, ...(string | string[])[]][] = [
        [addPostQuery, postId, post.authorId, post.title, post.contents],
        [addTagsQuery, uuidv4.generate(), postId, post.tagIds],
      ];

      await client.multiQuery(tx.map(([text, ...args]) => ({ text, args })))
    }
  };
}

export default createBlogService;
