import {
  ServerRequest,
  listenAndServe,
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

console.log(`Listening for requests on ${BINDING}...`);

// TODO: make reader import and call listenAndServe
await listenAndServe(
  BINDING,
  async (req: ServerRequest) => {
    logRequest(req);

    return req.respond({
      body: new TextEncoder().encode("Hello world!"),
    });
  },
);
