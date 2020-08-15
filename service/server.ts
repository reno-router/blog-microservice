import {
  ServerRequest,
  textResponse,
} from "../deps.ts";

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
    default:
      return serverError(e);
  }
}
