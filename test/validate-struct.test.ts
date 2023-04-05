import * as E from "fp-ts/Either";
import * as RA from "fp-ts/ReadonlyArray";
import { flow, pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { formatValidationErrors, groupByKey } from "../src";
import * as R from "fp-ts/Record";

const mapValidationErrors = flow(
  groupByKey,
  R.mapWithIndex((key, error) =>
    key === "foo" ? "Please provide a foo-string" : "unknown"
  ),
  R.toArray,
  RA.map(([_key, error]) => error)
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
});
