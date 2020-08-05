import {
  createRouteMap,
  jsonResponse,
  AugmentedRequest,
  forMethod,
  DBClient,
} from "../deps.ts";

import createBlogService from "./blog-service.ts";

const blogService = await createBlogService(DBClient);

export class PostNotFoundError extends Error {
  constructor(id: string) {
    super(`Post not found with ID ${id}`);
  }
}

export class InvalidUUIDError extends Error {
  constructor(id: string) {
    super(`ID ${id} is not a valid UUID`);
  }
}

function isUUIDError({ message }: Error) {
  return Boolean(message.match(/^invalid input syntax for type uuid/));
}

async function getPost(id: string) {
  try {
    const post = await blogService.getPost(id);

    if (!post) {
      throw new PostNotFoundError(id);
    }

    return post;
  } catch (e) {
    throw isUUIDError(e)
      ? new InvalidUUIDError(id)
      : e;
  }
}

async function getPosts({ routeParams: [id] }: AugmentedRequest) {
  const res = id
    ? await getPost(id)
    : await blogService.getPosts();

  return jsonResponse(res);
}

function createPost() {
  return jsonResponse({ id: "TODO" });
}

function editPost({ routeParams: [id] }: AugmentedRequest) {
  return jsonResponse({ id: "TODO" });
}

export default createRouteMap([
  [
    "/posts/*",
    forMethod([
      ["GET", getPosts],
      ["POST", createPost],
      ["PUT", editPost],
    ]),
  ],
]);
