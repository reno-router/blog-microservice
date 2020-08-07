import { DBClient, uuidv4 } from "../deps.ts";
import {
  GET_POSTS_QUERY,
  GET_POST_QUERY,
  CREATE_POST_QUERY,
  EDIT_POST_QUERY,
} from "./queries.ts";
import { CreatePostPayload } from "./routes.ts";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "POSTGRES_HOST"],
    ["user", "POSTGRES_USER"],
    ["password", "POSTGRES_PASSWORD"],
    ["database", "POSTGRES_DB"],
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

function fillBy<T>(n: number, by: () => T) {
  return Array(n).fill(0).map(by);
}

function buildQuery(text: string, ...args: (string | string[])[]) {
  return {
    text,
    args,
  };
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
      const res = await client.query(buildQuery(
        GET_POST_QUERY,
        id,
      ));

      const [post] = res.rowsOfObjects();

      return post as Post;
    },

    async createPost(post: CreatePostPayload): Promise<string> {
      const postId = uuidv4.generate();
      const [createPostQuery, createTagsQuery] = CREATE_POST_QUERY;

      // TODO: does this wrap queries in transactions?
      await client.multiQuery([
        buildQuery(
          createPostQuery,
          postId,
          post.authorId,
          post.title,
          post.contents,
        ),
        buildQuery(
          createTagsQuery,
          fillBy(post.tagIds.length, () => uuidv4.generate()),
          post.tagIds,
          postId,
        ),
      ]);

      return postId;
    },

    async editPost(id: string, contents: string): Promise<number> {
      const { rowCount } = await client.query(
        buildQuery(EDIT_POST_QUERY, id, contents),
      );
      return rowCount || 0;
    },
  };
}

export default createBlogService;
