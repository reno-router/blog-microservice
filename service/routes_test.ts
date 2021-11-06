import {
  assertResponsesAreEqual,
  assertStrictEquals,
  assertThrowsAsync,
  jsonResponse,
  sinon,
} from "../deps.ts";

import {
  createAddPostHandler,
  createEditPostHandler,
  createGetPostsHandler,
  PostNotFoundError,
} from "./routes.ts";

import test from "./test_utils.ts";

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

test("addPost route handler should add the post and return the ID", async () => {
  const id = "ID";

  const postPayload = {
    authorId: "author ID",
    tagIds: ["tag 1 ID", "tag 2 ID"],
    title: "My Post",
    contents: "The body",
  };

  const blogService = {
    createPost: sinon.stub().resolves(id),
  };

  const addPost = createAddPostHandler(blogService);
  const response = await addPost({ parsedBody: postPayload });

  assertResponsesAreEqual(response, jsonResponse({ id }));
  assertStrictEquals(blogService.createPost.callCount, 1);
});

test("editPost route handler should edit the post for the given ID and return said ID", async () => {
  const id = "ID";

  const editPayload = {
    contents: "Updated contents",
  };

  const blogService = {
    editPost: sinon.stub().resolves(1),
  };

  const editPost = createEditPostHandler(blogService);
  const response = await editPost({
    parsedBody: editPayload,
    routeParams: [id],
  });

  assertResponsesAreEqual(response, jsonResponse({ id }));
  assertStrictEquals(blogService.editPost.callCount, 1);
});

test("editPost route handler should reject with a PostNotFound error if a post for the given ID can't be found", async () => {
  const id = "nope";

  const editPayload = {
    contents: "Updated contents",
  };

  const blogService = {
    editPost: sinon.stub().resolves(0),
  };

  const editPost = createEditPostHandler(blogService);

  await assertThrowsAsync(
    () => editPost({ parsedBody: editPayload, routeParams: [id] }),
    PostNotFoundError,
    id,
  );
});
