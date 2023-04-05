import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as C from "io-ts/Codec";

const FormC = C.struct({
  foo: C.string,
  bar: C.number,
});

describe("report bad parts of struct in human friendly way", () => {
  describe("given a valid body", () => {
    const body = {
      foo: "foo",
      bar: 42,
    };

    const form = pipe(body, FormC.decode);
    it("returns form on right", () => {
      expect(form).toStrictEqual(E.right(body));
    });
  });
});
