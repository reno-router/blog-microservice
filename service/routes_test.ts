import {
  sinon,
  jsonResponse,
  assertResponsesAreEqual,
  assertStrictEquals,
} from "../deps.ts";
import { createGetPostsHandler } from "./routes.ts";

// TODO: EXPLAIN!
function withoutAsyncSanitisation(
  name: string,
  fn: () => void | Promise<void>,
) {
  return {
    name,
    fn,
    sanitizeResources: false,
    sanitizeOps: false,
  };
}

Deno.test(
  withoutAsyncSanitisation(
    "getPosts route handler should call retrieve the post for the given ID from the blog service",
    async () => {
      const id = "post ID";

      const post = {
        id,
        title: "Test Post",
        author: {
          id: "author ID",
          name: "James Wright",
        },
        tags: [
          { id: "tag ID", name: "JavaScript" },
          { id: "tag ID", name: "TypeScript" },
        ],
      };

      const blogService = {
        getPost: sinon.stub().resolves(post),
        getPosts: sinon.stub().resolves(),
      };

      const getPosts = createGetPostsHandler(blogService);
      const response = await getPosts({ routeParams: [id] });

      assertResponsesAreEqual(response, jsonResponse(post));
      assertStrictEquals(blogService.getPost.callCount, 1);
      assertStrictEquals(blogService.getPosts.callCount, 0);
    },
  ),
);
