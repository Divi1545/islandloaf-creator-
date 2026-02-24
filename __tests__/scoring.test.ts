import { calculateScore, formatNumber, formatCurrency } from "@/lib/utils/scoring";

describe("calculateScore", () => {
  it("should compute score = (views*0.7) + (likes*0.2) + (comments*0.1)", () => {
    expect(calculateScore(10000, 500, 100)).toBe(
      10000 * 0.7 + 500 * 0.2 + 100 * 0.1
    );
    // 7000 + 100 + 10 = 7110
    expect(calculateScore(10000, 500, 100)).toBe(7110);
  });

  it("should return 0 for all-zero inputs", () => {
    expect(calculateScore(0, 0, 0)).toBe(0);
  });

  it("should handle large numbers", () => {
    const views = 1_000_000;
    const likes = 50_000;
    const comments = 5_000;
    const expected = views * 0.7 + likes * 0.2 + comments * 0.1;
    expect(calculateScore(views, likes, comments)).toBe(expected);
  });

  it("should handle single-metric dominance", () => {
    expect(calculateScore(1000, 0, 0)).toBe(700);
    expect(calculateScore(0, 1000, 0)).toBe(200);
    expect(calculateScore(0, 0, 1000)).toBe(100);
  });
});

describe("formatNumber", () => {
  it("should format millions", () => {
    expect(formatNumber(1_500_000)).toBe("1.5M");
    expect(formatNumber(2_000_000)).toBe("2.0M");
  });

  it("should format thousands", () => {
    expect(formatNumber(1_500)).toBe("1.5K");
    expect(formatNumber(10_000)).toBe("10.0K");
  });

  it("should not format small numbers", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatCurrency", () => {
  it("should format cents to dollars", () => {
    expect(formatCurrency(100)).toBe("$1.00");
    expect(formatCurrency(5000)).toBe("$50.00");
    expect(formatCurrency(10050)).toBe("$100.50");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});
