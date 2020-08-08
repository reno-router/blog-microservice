// Recommended as per https://deno.land/std/manual.md#linking-to-third-party-code

export * from "https://deno.land/std@v0.62.0/http/server.ts";
export { v4 as uuidv4 } from "https://deno.land/std@v0.62.0/uuid/mod.ts";
export * from "https://deno.land/x/reno@v1.2.1/reno/mod.ts";
export { Pool as DBPool } from "https://deno.land/x/postgres@v0.4.3/mod.ts";

import __jsTestDouble from "https://dev.jspm.io/testdouble@3.16.0";
import * as TestDouble from "https://raw.githubusercontent.com/testdouble/testdouble.js/ecd90efe4649b287c33831a7b94a8a5eb96b8ed0/index.d.ts";
export const testdouble: typeof TestDouble =
  __jsTestDouble as typeof TestDouble;
