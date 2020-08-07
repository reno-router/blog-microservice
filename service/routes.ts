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

export interface EditPostPayload {
  contents: string;
}

export interface CreatePostPayload extends EditPostPayload {
  authorId: string;
  tagIds: string[];
  title: string;
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
  const res = await (id ? getPost(id) : blogService.getPosts());
  return jsonResponse(res);
}

const createPost = withJsonBody<CreatePostPayload>(
  async function createPost({ body }) {
    const id = await blogService.createPost(body);
    return jsonResponse({ id });
  },
);

const editPost = withJsonBody<EditPostPayload>(
  async function editPost({ body: { contents }, routeParams: [id] }) {
    await blogService.editPost(id, contents);
    return jsonResponse({ id });
  },
);

export default createRouteMap([
  [
    "/posts/*",
    forMethod([
      ["GET", getPosts],
      ["POST", createPost],
      ["PATCH", editPost],
    ]),
  ],
]);
