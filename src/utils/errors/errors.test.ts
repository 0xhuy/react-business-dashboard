import { describe, expect, it } from "vitest";

import { normalizeError } from "./errors";

describe("normalizeError", () => {
  it("maps a duplicate database record", () => {
    expect(normalizeError({ code: "23505" })).toMatchObject({
      code: "23505",
      translationKey: "errors.database.duplicate",
      retryable: false,
    });
  });

  it("maps a permission error", () => {
    expect(normalizeError({ code: "42501" }).translationKey).toBe(
      "errors.forbidden",
    );
  });

  it("marks network errors as retryable", () => {
    expect(normalizeError(new Error("Failed to fetch"))).toMatchObject({
      code: "NETWORK_ERROR",
      translationKey: "errors.network",
      retryable: true,
    });
  });

  it("marks server errors as retryable", () => {
    expect(normalizeError({ status: 503 })).toMatchObject({
      translationKey: "errors.server",
      status: 503,
      retryable: true,
    });
  });
});
