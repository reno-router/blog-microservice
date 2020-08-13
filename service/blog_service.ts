import { DBPool, uuidv4 } from "../deps.ts";
import createDbService, { buildQuery, DbService } from "./db_service.ts";

import {
  GET_POSTS_QUERY,
  GET_POST_QUERY,
  CREATE_POST_QUERY,
  EDIT_POST_QUERY,
} from "./queries.ts";

import { CreatePostPayload } from "./routes.ts";

function fillBy<T>(n: number, by: () => T) {
  return Array(n).fill(0).map(by);
}

interface Entity {
  id: string;
  name: string;
}

interface PostMetadata {
  id: string;
  author: Entity;
  tags: Entity[];
  title: string;
}

interface Post extends PostMetadata {
  contents: string;
}

function createBlogService(db: DbService, getUuid: () => string) {
  return {
    async getPosts(): Promise<PostMetadata[]> {
      const res = await db.query(GET_POSTS_QUERY);
      return res.rowsOfObjects() as PostMetadata[];
    },

    async getPost(id: string): Promise<Post> {
      const res = await db.query(GET_POST_QUERY, id);
      const [post] = res.rowsOfObjects();

      return post as Post;
    },

    async createPost(post: CreatePostPayload): Promise<string> {
      const postId = getUuid();
      const [createPostQuery, createTagsQuery] = CREATE_POST_QUERY;

      await db.tx(async (c) => {
        await c.query(buildQuery(
          createPostQuery,
          postId,
          post.authorId,
          post.title,
          post.contents,
        ));

        await c.query(buildQuery(
          createTagsQuery,
          fillBy(post.tagIds.length, getUuid),
          post.tagIds,
          postId,
        ));
      });

      return postId;
    },

    async editPost(id: string, contents: string): Promise<number> {
      const { rowCount } = await db.query(
        EDIT_POST_QUERY,
        id,
        contents,
      );

      return rowCount || 0;
    },
  };
}

export type BlogService = ReturnType<typeof createBlogService>;
export default createBlogService;
