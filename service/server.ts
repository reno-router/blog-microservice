import {
  ServerRequest,
  listenAndServe,
  createRouter,
  NotFoundError,
  textResponse,
} from "../deps.ts";

import routes, { PostNotFoundError, InvalidUUIDError } from "./routes.ts";

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

function createErrorResponse(status: number, { message }: Error) {
  return {
    status,
    ...textResponse(message),
  };
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
    case NotFoundError:
    case PostNotFoundError:
      return notFound(e);

    case InvalidUUIDError:
      return badRequest(e);

    default:
      return serverError(e);
  }
}

const router = createRouter(routes);

console.log(`Listening for requests on ${BINDING}...`);

await listenAndServe(
  BINDING,
  async (req: ServerRequest) => {
    logRequest(req);

    try {
      return req.respond(await router(req));
    } catch (e) {
      return req.respond(mapToErrorResponse(e));
    }
  },
);
