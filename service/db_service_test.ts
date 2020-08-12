import {
  sinon,
  assertEquals,
  assertStrictEquals,
  assertThrowsAsync,
  assert,
} from "../deps.ts";

import test from "./test_utils.ts";
import createDbService, { buildQuery } from "./db_service.ts";

function createPool(queryResult: {} | Error) {
  const client = {
    query: sinon.stub()[queryResult instanceof Error ? "rejects" : "resolves"](
      queryResult,
    ),
    release: sinon.stub(),
  };

  const dbPool = {
    connect: sinon.stub().resolves(client),
  };

  return [dbPool, client] as const;
}

test("dbService.query should retrieve a client from the pool, invoke a query against it, and the release it", async () => {
  const query = "select foo from bar where x = $1";
  const args = ["y"];

  const queryResult = {
    id: "foo",
  };

  const [dbPool, client] = createPool(queryResult);
  const dbService = createDbService(dbPool);
  const result = await dbService.query(query, args);

  assertEquals(result, queryResult);
  assertStrictEquals(dbPool.connect.callCount, 1);
  assertStrictEquals(client.query.callCount, 1);
  assertStrictEquals(client.release.callCount, 1);

  assertStrictEquals(
    client.query.calledWithExactly(buildQuery(query, args)),
    true,
  );
});

test("dbService.query should still release the connection if the query throws an error", async () => {
  const query = "select foo from bar where x = $1";
  const args = ["y"];

  const [dbPool, client] = createPool(new Error("no"));
  const dbService = createDbService(dbPool);

  await assertThrowsAsync(
    () => dbService.query(query, args),
    Error,
    "no",
  );

  assertStrictEquals(client.release.callCount, 1);
});
