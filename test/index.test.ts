import { hello } from "../src";

describe("hello world", () => {
  it("passes", () => {
    expect(hello()).toContain("hello");
  });
});
