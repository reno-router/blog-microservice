import {
  sinon,
  jsonResponse,
  assertResponsesAreEqual,
  assertStrictEquals,
} from "../deps.ts";

import { createGetPostsHandler, PostNotFoundError } from "./routes.ts";
import test from "./test_utils.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.62.0/testing/asserts.ts";

test(
  "getPosts route handler should retrieve all posts when an ID isn't provided in the route params",
  async () => {
    const posts = ["1", "2"].map((id) => ({
      id,
      title: `Test Post ${id}`,
      author: {
        id: "author ID",
        name: "James Wright",
      },
      tags: [
        { id: "tag ID", name: "JavaScript" },
        { id: "tag ID", name: "TypeScript" },
      ],
    }));

    const blogService = {
      getPosts: sinon.stub().resolves(posts),
      getPost: sinon.stub().resolves(),
    };

    const getPosts = createGetPostsHandler(blogService);
    const response = await getPosts({ routeParams: [] });

    assertResponsesAreEqual(response, jsonResponse(posts));
    assertStrictEquals(blogService.getPost.callCount, 0);
    assertStrictEquals(blogService.getPosts.callCount, 1);
  },
);

test(
  "getPosts route handler should retrieve the post for the given ID from the blog service",
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
);

test("getPosts route handler should reject with a PostNotFound error if the provided ID cannot be found", async () => {
  const id = "nope";

  const blogService = {
    getPost: sinon.stub().resolves(),
    getPosts: sinon.stub().resolves(),
  };

  const getPosts = createGetPostsHandler(blogService);

  await assertThrowsAsync(
    () => getPosts({ routeParams: [id] }),
    PostNotFoundError,
    id,
  );

  assertStrictEquals(blogService.getPost.callCount, 1);
  assertStrictEquals(blogService.getPosts.callCount, 0);
});
