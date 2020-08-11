// Recommended as per https://deno.land/std/manual.md#linking-to-third-party-code

export * from "https://deno.land/std@v0.62.0/http/server.ts";
export { v4 as uuidv4 } from "https://deno.land/std@v0.62.0/uuid/mod.ts";
export * from "https://deno.land/std@v0.62.0/testing/asserts.ts";
export * from "https://deno.land/x/reno@v1.2.1/reno/mod.ts";
export { Pool as DBPool } from "https://deno.land/x/postgres@v0.4.3/mod.ts";
export { PoolClient as DBPoolClient } from "https://deno.land/x/postgres@v0.4.3/client.ts";

/* Skypack has a ?dts query param that will
 * download TS definitions along with the
 * module code, but sadly this doesn't work
 * at the moment due to the issue described
 * at the head of ./types/sinon.d.ts */
import * as __jsSinon from "https://cdn.skypack.dev/sinon@9.0.3";
import { SinonSandbox } from "./types/sinon.d.ts";

export const sinon: Omit<SinonSandbox, "clock" | "requests" | "server"> =
  __jsSinon;
