// Recommended as per https://deno.land/std/manual.md#linking-to-third-party-code

export * from "https://deno.land/std@v0.62.0/http/server.ts";
export { v4 as uuidv4 } from "https://deno.land/std@v0.62.0/uuid/mod.ts";
export * from "https://deno.land/std@v0.62.0/testing/asserts.ts";
export * from "https://deno.land/x/reno@v1.2.1/reno/mod.ts";
export { Pool as DBPool } from "https://deno.land/x/postgres@v0.4.3/mod.ts";
export { PoolClient as DBPoolClient } from "https://deno.land/x/postgres@v0.4.3/client.ts";

// import * as __jsSinon from 'https://jspm.dev/sinon@9.0.3';
// import * as Sinon from "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/3e69dd6158baad145f2eaf1f44492d407a24ce5e/types/sinon/index.d.ts";
// export const sinon: typeof Sinon = __jsSinon;

// TODO: explain why not using ?dts
import * as __jsSinon from "https://cdn.skypack.dev/sinon@9.0.3";
import { SinonSandbox } from "./types/sinon.d.ts";

export const sinon: Omit<SinonSandbox, "clock" | "requests" | "server"> =
  __jsSinon;
