import {
  createRouteMap,
  textResponse,
  AugmentedRequest,
  Status,
} from "../deps.ts";

function posts({ method, routeParams }: AugmentedRequest) {
  const [id] = routeParams;

  if (method === "GET") {
    return textResponse(`You requested to retrieve ${id || "all posts"}`);
  }

  if (method === "POST") {
    return textResponse(`You requested to create a new post`);
  }

  if (method === "PUT") {
    return textResponse(`You requested to edit the contents of ${id}`);
  }

  return textResponse(`Method ${method} not allowed for /posts`, {
    status: Status.MethodNotAllowed,
  });
}

export default createRouteMap([
  ["/posts/*", posts],
]);
