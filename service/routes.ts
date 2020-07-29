import {
  createRouteMap,
  textResponse,
  AugmentedRequest,
  forMethod,
  MySQLClient,
} from "../deps.ts";

import createBlogService from "./blog-service.ts";

const blogService = await createBlogService(MySQLClient);

async function getPosts({ routeParams: [id] }: AugmentedRequest) {
  const posts = await blogService.getPosts();
  return textResponse(`Result: ${JSON.stringify(posts)}`);
}

function createPost() {
  return textResponse(`You requested to create a new post`);
}

function editPost({ routeParams: [id] }: AugmentedRequest) {
  return textResponse(`You requested to edit the contents of ${id}`);
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
