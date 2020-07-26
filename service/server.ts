import {
  ServerRequest,
  listenAndServe,
  createRouter,
} from "../deps.ts";

import routes from "./routes.ts";

const BINDING = ":8000";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function logRequest(req: ServerRequest) {
  console.log(`[${formatDate(new Date())}] Request for ${req.url}`);
}

const router = createRouter(routes);

console.log(`Listening for requests on ${BINDING}...`);

await listenAndServe(
  BINDING,
  async (req: ServerRequest) => {
    logRequest(req);

    return req.respond(await router(req));
  },
);
