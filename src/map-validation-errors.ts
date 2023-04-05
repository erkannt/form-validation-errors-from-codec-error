import * as t from "io-ts";
import * as R from "fp-ts/Record";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/lib/function";
import { groupByKey } from ".";
import * as O from "fp-ts/Option";

export const mapValidationErrors =
  <T>(errorMap: Record<string, T>) =>
  (validationErrors: t.Errors) =>
    pipe(
      validationErrors,
      groupByKey,
      R.keys,
      RA.map((key) =>
        pipe(
          errorMap,
          R.lookup(key),
          O.getOrElseW(
            () => "Whoops. Something is wrong, but I don't know what"
          )
        )
      )
    );
