import {
  sinon,
  jsonResponse,
  assertResponsesAreEqual,
  assertStrictEquals,
} from "../deps.ts";
import { createGetPostsHandler } from "./routes.ts";

/* Deno's test runner has really handy sanitisers
 * to determine if a test is failing to dispose of
 * resources (e.g. file handles) or async ops
 * (e.g. microtasks), but sadly even just
 * *referencing* the `sinon` binding creates
 * some sort of timer that's never cleared. This
 * function reduces the boilerplate of manually
 * specifying the full-form Deno.test() object
 * arg for each test with the sanitize* props
 * set to `false`.
 *
 * https://deno.land/manual/testing#resource-and-async-op-sanitizers
 *
 * TODO: replace Sinon import source of migrate to
 * another stub library that isn't testdouble.js */
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
