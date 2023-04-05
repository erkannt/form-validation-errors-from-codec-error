import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

const ConflictOfInterestC = t.union([
	t.type({hasConflictOfInterest: t.literal('no')}),
	t.type({hasConflictOfInterest: t.literal('yes'), conflictOfInterestDetails: tt.NonEmptyString}),
]
)

describe('report bad parts of union in human friendly way', () => {
	describe('given a valid body', () => {
    const body = {
      hasConflictOfInterest: "no",
    };

    const form = pipe(body, ConflictOfInterestC.decode);

    it("returns form on right", () => {
      expect(form).toStrictEqual(E.right(body));
    });
	})
})