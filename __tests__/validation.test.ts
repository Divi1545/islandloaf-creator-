import {
  otpRequestSchema,
  otpVerifySchema,
  roleSelectSchema,
  createCampaignSchema,
  createSubmissionSchema,
  payoutRequestSchema,
  parseBody,
} from "@/lib/utils/validation";

describe("otpRequestSchema", () => {
  it("should accept valid email", () => {
    expect(otpRequestSchema.safeParse({ email: "test@example.com" }).success).toBe(true);
  });

  it("should reject invalid email", () => {
    expect(otpRequestSchema.safeParse({ email: "notanemail" }).success).toBe(false);
    expect(otpRequestSchema.safeParse({ email: "" }).success).toBe(false);
  });
});

describe("otpVerifySchema", () => {
  it("should accept 6-digit token", () => {
    expect(otpVerifySchema.safeParse({ email: "a@b.com", token: "123456" }).success).toBe(true);
  });

  it("should reject short or long tokens", () => {
    expect(otpVerifySchema.safeParse({ email: "a@b.com", token: "12345" }).success).toBe(false);
    expect(otpVerifySchema.safeParse({ email: "a@b.com", token: "1234567" }).success).toBe(false);
  });
});

describe("roleSelectSchema", () => {
  it("should accept creator or brand", () => {
    expect(roleSelectSchema.safeParse({ role: "creator" }).success).toBe(true);
    expect(roleSelectSchema.safeParse({ role: "brand" }).success).toBe(true);
  });

  it("should reject admin/moderator roles", () => {
    expect(roleSelectSchema.safeParse({ role: "admin" }).success).toBe(false);
    expect(roleSelectSchema.safeParse({ role: "moderator" }).success).toBe(false);
  });
});

describe("createCampaignSchema", () => {
  const validCampaign = {
    title: "Test Campaign",
    description: "This is a valid test campaign for testing",
    type: "free" as const,
    prize_pool: 10000,
    entry_fee: 0,
    target_views: 50000,
    platform: "tiktok" as const,
    hashtags: ["#test"],
    required_tag: "@IslandLoaf",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  it("should accept valid campaign", () => {
    expect(createCampaignSchema.safeParse(validCampaign).success).toBe(true);
  });

  it("should reject short title", () => {
    expect(createCampaignSchema.safeParse({ ...validCampaign, title: "ab" }).success).toBe(false);
  });

  it("should reject past deadline", () => {
    expect(
      createCampaignSchema.safeParse({
        ...validCampaign,
        deadline: "2020-01-01T00:00:00Z",
      }).success
    ).toBe(false);
  });

  it("should reject invalid platform", () => {
    expect(
      createCampaignSchema.safeParse({ ...validCampaign, platform: "twitter" }).success
    ).toBe(false);
  });

  it("should reject empty hashtags", () => {
    expect(
      createCampaignSchema.safeParse({ ...validCampaign, hashtags: [] }).success
    ).toBe(false);
  });
});

describe("createSubmissionSchema", () => {
  it("should accept valid submission", () => {
    expect(
      createSubmissionSchema.safeParse({
        campaign_id: "550e8400-e29b-41d4-a716-446655440000",
        video_url: "https://tiktok.com/@user/video/123",
        platform: "tiktok",
        posted_at: new Date().toISOString(),
      }).success
    ).toBe(true);
  });

  it("should reject non-UUID campaign_id", () => {
    expect(
      createSubmissionSchema.safeParse({
        campaign_id: "not-a-uuid",
        video_url: "https://example.com",
        platform: "tiktok",
        posted_at: new Date().toISOString(),
      }).success
    ).toBe(false);
  });

  it("should reject invalid URL", () => {
    expect(
      createSubmissionSchema.safeParse({
        campaign_id: "550e8400-e29b-41d4-a716-446655440000",
        video_url: "not-a-url",
        platform: "tiktok",
        posted_at: new Date().toISOString(),
      }).success
    ).toBe(false);
  });
});

describe("payoutRequestSchema", () => {
  it("should accept valid amount (>= $1.00 = 100 cents)", () => {
    expect(payoutRequestSchema.safeParse({ amount: 100 }).success).toBe(true);
    expect(payoutRequestSchema.safeParse({ amount: 5000 }).success).toBe(true);
  });

  it("should reject amount below minimum", () => {
    expect(payoutRequestSchema.safeParse({ amount: 50 }).success).toBe(false);
    expect(payoutRequestSchema.safeParse({ amount: 0 }).success).toBe(false);
  });
});

describe("parseBody", () => {
  it("should return success with parsed data on valid input", () => {
    const result = parseBody(otpRequestSchema, { email: "test@example.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("should return error message on invalid input", () => {
    const result = parseBody(otpRequestSchema, { email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("email");
    }
  });
});
