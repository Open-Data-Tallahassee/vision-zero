import { describe, expect, it } from "vitest";
import { formatCount } from "./format";

describe("formatCount", () => {
  it("displays unavailable counts without treating them as zero", () => {
    expect(formatCount(null)).toBe("—");
    expect(formatCount(Number.NaN)).toBe("—");
    expect(formatCount(0)).toBe("0");
    expect(formatCount(1234)).toBe("1,234");
  });
});
