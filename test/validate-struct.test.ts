import * as E from "fp-ts/Either";
import * as RA from "fp-ts/ReadonlyArray";
import { flow, pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { formatValidationErrors, groupByKey } from "../src";
import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";

const mapValidationErrors = flow(
  groupByKey,
  R.keys,
  RA.map((key) =>
    pipe(
      {
        foo: "Please provide a foo-string",
        bar: "Please provide a bar-number",
      },
      R.lookup(key),
      O.getOrElse(() => "Whoops. Something is wrong, but I don't know what")
    )
  )
);

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

    const form = pipe(body, FormC.decode, E.mapLeft(mapValidationErrors));

    it("return a human friendly prompt as part of left", () => {
      expect(form).toStrictEqual(E.left(["Please provide a foo-string"]));
    });
  });

  describe("given a body missing all fields", () => {
    const body = {};

    const form = pipe(body, FormC.decode, E.mapLeft(mapValidationErrors));

    it("return a human friendly prompt as part of left", () => {
      expect(form).toStrictEqual(
        E.left(
          expect.arrayContaining([
            "Please provide a foo-string",
            "Please provide a bar-number",
          ])
        )
      );
    });
  });
});
