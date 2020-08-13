import { sinon, assertEquals, assertStrictEquals } from "../deps.ts";
import createBlogService from "./blog_service.ts";
import test from "./test_utils.ts";

function createDbService<TQueryResult>(
  queryResult: TQueryResult[],
  includeRowCount = true,
) {
  const txClient = {
    query: sinon.stub().resolves(),
  };

  return {
    query: sinon.stub().resolves({
      rowsOfObjects: () => queryResult,
      rowCount: includeRowCount ? queryResult.length : undefined,
    }),
    tx: sinon.stub().callsArgWithAsync(0, txClient).resolves(),
  };
}

test("blogService.getPosts() should return all posts in the database", async () => {
  const posts = [1, 2, 3].map((x) => ({ id: `post ${x}` }));
  const dbService = createDbService(posts);
  const blogService = createBlogService(dbService);
  const actualPosts = await blogService.getPosts();

  assertEquals(actualPosts, posts);
  assertStrictEquals(dbService.query.callCount, 1);
});

test("blogService.getPost() should return the post for the given ID", async () => {
  const posts = [{ id: "post 1" }];
  const dbService = createDbService(posts);
  const blogService = createBlogService(dbService);
  const actualPost = await blogService.getPost("post 1");

  assertEquals(actualPost, posts[0]);
  assertStrictEquals(dbService.query.callCount, 1);
});

// TODO: tests for createPost

test("blogService.editPost() should update the contents of the given post ID and return the row count", async () => {
  const posts = [{ id: "post 1" }];
  const dbService = createDbService(posts);
  const blogService = createBlogService(dbService);
  const rowCount = await blogService.editPost("post 1", "Updated contents!");

  assertEquals(rowCount, 1);
  assertStrictEquals(dbService.query.callCount, 1);
});

test("blogService.editPost() should return 0 if the underlying row count is undefined", async () => {
  const posts = [{ id: "post 1" }];
  const dbService = createDbService(posts, false);
  const blogService = createBlogService(dbService);
  const rowCount = await blogService.editPost("post 1", "Updated contents!");

  assertEquals(rowCount, 0);
  assertStrictEquals(dbService.query.callCount, 1);
});
