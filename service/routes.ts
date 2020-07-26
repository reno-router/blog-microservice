import { createRouteMap, textResponse } from "../deps.ts";

export default createRouteMap([
  ["/", () => textResponse("Hello world!")],
]);
