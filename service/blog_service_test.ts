import {
  sinon,
  assertEquals,
  assertStrictEquals,
  DBPoolClient,
} from "../deps.ts";
import createBlogService from "./blog_service.ts";
import test from "./test_utils.ts";
import { CREATE_POST_QUERY } from "./queries.ts";
import { buildQuery } from "./db_service.ts";

function createDbService<TQueryResult>(
  queryResult: TQueryResult[],
  includeRowCount = true,
) {
  const txClient = {
    query: sinon.stub().resolves(),
  };

  const dbService = {
    query: sinon.stub().resolves({
      rowsOfObjects: () => queryResult,
      rowCount: includeRowCount ? queryResult.length : undefined,
    }),
    tx: async (cb: (c: Pick<DBPoolClient, "query">) => Promise<void>) => {
      await cb(txClient);
    },
  };

  return [dbService, txClient] as const;
}

function getUuid() {
  return "uuid";
}

test("blogService.getPosts() should return all posts in the database", async () => {
  const posts = [1, 2, 3].map((x) => ({ id: `post ${x}` }));
  const [dbService] = createDbService(posts);
  const blogService = createBlogService(dbService, getUuid);
  const actualPosts = await blogService.getPosts();

  assertEquals(actualPosts, posts);
  assertStrictEquals(dbService.query.callCount, 1);
});

test("blogService.getPost() should return the post for the given ID", async () => {
  const posts = [{ id: "post 1" }];
  const [dbService] = createDbService(posts);
  const blogService = createBlogService(dbService, getUuid);
  const actualPost = await blogService.getPost("post 1");

  assertEquals(actualPost, posts[0]);
  assertStrictEquals(dbService.query.callCount, 1);
});

test("blogService.createPost() should run the create post and tags queries within a transaction", async () => {
  const [createPostQuery, createTagsQuery] = CREATE_POST_QUERY;
  const authorId = "author ID";
  const tagIds = ["tag 1 ID", "tag 2 ID"];
  const title = "My Post";
  const contents = "The body";

  const postPayload = {
    authorId,
    tagIds,
    title,
    contents,
  };

  const getUuid = sinon.stub();
  const [dbService, txClient] = createDbService([]);
  const blogService = createBlogService(dbService, getUuid);

  [1, 2, 3].forEach((x, i) => {
    getUuid.onCall(i).returns(`uuid-${x}`);
  });

  const postId = await blogService.createPost(postPayload);

  assertStrictEquals(postId, "uuid-1");

  assertEquals(txClient.query.getCalls().map(({ args: [query] }) => query), [
    buildQuery(
      createPostQuery,
      postId,
      authorId,
      title,
      contents,
    ),
    buildQuery(
      createTagsQuery,
      [
        "uuid-2",
        "uuid-3",
      ],
      tagIds,
      postId,
    ),
  ]);
});

test("blogService.editPost() should update the contents of the given post ID and return the row count", async () => {
  const posts = [{ id: "post 1" }];
  const [dbService] = createDbService(posts);
  const blogService = createBlogService(dbService, getUuid);
  const rowCount = await blogService.editPost("post 1", "Updated contents!");

  assertEquals(rowCount, 1);
  assertStrictEquals(dbService.query.callCount, 1);
});

test("blogService.editPost() should return 0 if the underlying row count is undefined", async () => {
  const posts = [{ id: "post 1" }];
  const [dbService] = createDbService(posts, false);
  const blogService = createBlogService(dbService, getUuid);
  const rowCount = await blogService.editPost("post 1", "Updated contents!");

  assertEquals(rowCount, 0);
  assertStrictEquals(dbService.query.callCount, 1);
});
