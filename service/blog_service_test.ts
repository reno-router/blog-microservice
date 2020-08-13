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
