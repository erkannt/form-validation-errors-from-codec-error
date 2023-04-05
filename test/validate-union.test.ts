import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import * as tt from "io-ts-types";
import { groupByKey } from "../src";

const ConflictOfInterestC = t.union([
  t.type({ hasConflictOfInterest: t.literal("no") }),
  t.type({
    hasConflictOfInterest: t.literal("yes"),
    conflictOfInterestDetails: tt.NonEmptyString,
  }),
]);

describe("report bad parts of union in human friendly way", () => {
  describe("given a valid body", () => {
    const body = {
      hasConflictOfInterest: "no",
    };

    const form = pipe(body, ConflictOfInterestC.decode);

    it("returns form on right", () => {
      expect(form).toStrictEqual(E.right(body));
    });
  });

  describe("given no member of the union is valid", () => {
    const body = {
      hasConflictOfInterest: undefined,
    };

    const form = pipe(body, ConflictOfInterestC.decode, E.mapLeft(groupByKey));
    it.failing("returns something useful on the left", () => {
      expect(form).toStrictEqual(E.left("whoops"));
    });
  });
});
