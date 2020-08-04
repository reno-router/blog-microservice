import {
  createRouteMap,
  jsonResponse,
  AugmentedRequest,
  forMethod,
  DBClient,
} from "../deps.ts";

import createBlogService from "./blog-service.ts";

const blogService = await createBlogService(DBClient);

async function getPosts({ routeParams: [id] }: AugmentedRequest) {
  const posts = await blogService.getPosts();
  return jsonResponse(posts);
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
