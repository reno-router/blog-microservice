/* Deno's test runner has really handy sanitisers
 * to determine if a test is failing to dispose of
 * resources (e.g. file handles) or async ops
 * (e.g. microtasks), but sadly even just
 * *referencing* the `sinon` binding creates
 * some sort of timer that's never cleared. This
 * function reduces the boilerplate of manually
 * specifying the full-form Deno.test() object
 * arg for each test with the sanitizeOps prop
 * set to `false`.
 *
 * https://deno.land/manual/testing#resource-and-async-op-sanitizers
 *
 * TODO: replace Sinon import source or migrate to
 * another stub library that isn't testdouble.js */
export default function test(
  name: string,
  fn: () => void | Promise<void>,
) {
  Deno.test({
    name,
    fn,
    sanitizeOps: false,
  });
}
