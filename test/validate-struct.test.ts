import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { ValidationError } from "io-ts";
import { formatValidationErrors } from "io-ts-reporters";
import * as C from "io-ts/Codec";
import { DecodeError } from "io-ts/lib/Decoder";
import * as t from "io-ts";

const FormC = t.type({
  foo: t.string,
  bar: t.number,
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

  describe("given a body missing a field", () => {
    const body = {
      bar: 42,
    };

    const form = pipe(body, FormC.decode, E.mapLeft(formatValidationErrors));

    it.failing("return a human friendly prompt as part of left", () => {
      expect(form).toStrictEqual(E.left("Please provide a string for `foo`"));
    });
  });
});
