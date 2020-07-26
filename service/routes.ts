import {
  createRouteMap,
  textResponse,
  AugmentedRequest,
  forMethod,
} from "../deps.ts";

function getPosts({ routeParams: [id] }: AugmentedRequest) {
  return textResponse(`You requested to retrieve ${id || "all posts"}`);
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
