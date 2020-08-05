import {
  createRouteMap,
  jsonResponse,
  AugmentedRequest,
  forMethod,
  DBClient,
  withJsonBody,
} from "../deps.ts";

import createBlogService from "./blog-service.ts";

const blogService = await createBlogService(DBClient);

export interface PostPayload {
  authorId: string;
  tagIds: string[];
  title: string
  contents: string;
}

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
    throw isUUIDError(e) ? new InvalidUUIDError(id) : e;
  }
}

async function getPosts({ routeParams: [id] }: AugmentedRequest) {
  const res = id ? await getPost(id) : await blogService.getPosts();

  return jsonResponse(res);
}

const createPost = withJsonBody<PostPayload>(async function createPost({ body }) {
  await blogService.addPost(body);

  return jsonResponse({ ok: true }); // TODO: return new DB item?
});

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
