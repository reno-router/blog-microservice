import {
  listenAndServe,
  createRouter,
  MissingRouteError,
  DBPool,
  uuidv4,
} from "../deps.ts";

import createBlogService from "./blog_service.ts";
import createDbService from "./db_service.ts";
import createRoutes, { PostNotFoundError, InvalidUuidError } from "./routes.ts";

const BINDING = ":8000";

function createClientOpts() {
  return Object.fromEntries([
    ["hostname", "POSTGRES_HOST"],
    ["user", "POSTGRES_USER"],
    ["password", "POSTGRES_PASSWORD"],
    ["database", "POSTGRES_DB"],
  ].map(([key, envVar]) => [key, Deno.env.get(envVar)]));
}

function getPoolConnectionCount() {
  return Number.parseInt(Deno.env.get("POSTGRES_POOL_CONNECTIONS") || "1", 10);
}

const dbPool = new DBPool(createClientOpts(), getPoolConnectionCount());

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

function logRequest(req: Request) {
  console.log(`[${formatDate(new Date())}] Request for ${req.url}`);
}

function createErrorResponse(status: number, { message }: Error) {
  return new Response(message, {
    status,
  });
}

function badRequest(e: Error) {
  return createErrorResponse(400, e);
}

function notFound(e: Error) {
  return createErrorResponse(404, e);
}

function serverError(e: Error) {
  return createErrorResponse(500, e);
}

function mapToErrorResponse(e: Error) {
  switch (e.constructor) {
    case MissingRouteError:
    case PostNotFoundError:
      return notFound(e);

    case InvalidUuidError:
      return badRequest(e);

    default:
      return serverError(e);
  }
}

const blogService = createBlogService(
  createDbService(dbPool),
  uuidv4.generate,
);

const router = createRouter(createRoutes(blogService));

console.log(`Listening for requests on ${BINDING}...`);

await listenAndServe(
  BINDING,
  async req => {
    logRequest(req);

    try {
      return await router(req);
    } catch (e) {
      return mapToErrorResponse(e);
    }
  },
);
