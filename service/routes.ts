import {
  createRouteMap,
  jsonResponse,
  AugmentedRequest,
  forMethod,
  withJsonBody,
  RouteHandler,
} from "../deps.ts";

import { BlogService } from "./blog_service.ts";

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

async function getPost(blogService: Pick<BlogService, "getPost">, id: string) {
  const post = await blogService.getPost(id);

  if (!post) {
    throw new PostNotFoundError(id);
  }

  return post;
}

/* Don't introduce route handler factories
 * until the end of the article! */
export function createGetPostsHandler(
  blogService: Pick<BlogService, "getPosts" | "getPost">,
) {
  return async function getPosts(
    { routeParams: [id] }: Pick<AugmentedRequest, "routeParams">,
  ) {
    const res = await (id ? getPost(blogService, id) : blogService.getPosts());
    return jsonResponse(res);
  };
}

function createAddPostHandler(blogService: BlogService) {
  return withJsonBody<CreatePostPayload>(
    async function addPost({ body }) {
      const id = await blogService.createPost(body);
      return jsonResponse({ id });
    },
  );
}

function createEditPostHandler(blogService: BlogService) {
  return withJsonBody<EditPostPayload>(
    async function editPost({ body: { contents }, routeParams: [id] }) {
      const rowCount = await blogService.editPost(id, contents);

      if (rowCount === 0) {
        throw new PostNotFoundError(id);
      }

      return jsonResponse({ id });
    },
  );
}

export default function createRoutes(blogService: BlogService) {
  return createRouteMap([
    [
      "/posts/*",
      handleServiceErrors(
        forMethod([
          ["GET", createGetPostsHandler(blogService)],
          ["POST", createAddPostHandler(blogService)],
          ["PATCH", createEditPostHandler(blogService)],
        ]),
      ),
    ],
  ]);
}
