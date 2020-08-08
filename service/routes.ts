import {
  createRouteMap,
  jsonResponse,
  AugmentedRequest,
  forMethod,
  DBPool,
  withJsonBody,
  RouteHandler,
} from "../deps.ts";

import createBlogService from "./blog-service.ts";

const blogService = await createBlogService(DBPool);

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

export class InvalidUuidError extends Error {
  constructor(id: string) {
    super(`ID ${id} is not a valid Uuid`);
  }
}

function isUuidError({ message }: Error) {
  return Boolean(message.match(/invalid input syntax for type uuid/));
}

function handleServiceErrors(next: RouteHandler): RouteHandler {
  return async (req: AugmentedRequest) => {
    try {
      return await next(req);
    } catch (e) {
      throw isUuidError(e) ? new InvalidUuidError(req.routeParams[0]) : e;
    }
  };
}

async function getPost(id: string) {
  const post = await blogService.getPost(id);

  if (!post) {
    throw new PostNotFoundError(id);
  }

  return post;
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
    const rowCount = await blogService.editPost(id, contents);

    if (rowCount === 0) {
      throw new PostNotFoundError(id);
    }

    return jsonResponse({ id });
  },
);

export default createRouteMap([
  [
    "/posts/*",
    handleServiceErrors(
      forMethod([
        ["GET", getPosts],
        ["POST", createPost],
        ["PATCH", editPost],
      ]),
    ),
  ],
]);
