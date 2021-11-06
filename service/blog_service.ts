import { buildQuery, DbService } from "./db_service.ts";

import {
  CREATE_POST_QUERY,
  EDIT_POST_QUERY,
  GET_POST_QUERY,
  GET_POSTS_QUERY,
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
      return (await db.query<PostMetadata>(GET_POSTS_QUERY)).rows;
    },

    async getPost(id: string): Promise<Post> {
      const [post] = (await db.query<Post>(GET_POST_QUERY, id)).rows;
      return post as Post;
    },

    async createPost(post: CreatePostPayload): Promise<string> {
      const postId = getUuid();
      const [createPostQuery, createTagsQuery] = CREATE_POST_QUERY;

      await db.tx(async (c) => {
        await c.queryObject(buildQuery(
          createPostQuery,
          postId,
          post.authorId,
          post.title,
          post.contents,
        ));

        await c.queryObject(buildQuery(
          createTagsQuery,
          fillBy(post.tagIds.length, getUuid),
          post.tagIds,
          postId,
        ));
      });

      return postId;
    },

    async editPost(id: string, contents: string): Promise<number> {
      const { rowCount = 0 } = await db.query(
        EDIT_POST_QUERY,
        id,
        contents,
      );

      return rowCount;
    },
  };
}

export type BlogService = ReturnType<typeof createBlogService>;
export default createBlogService;
