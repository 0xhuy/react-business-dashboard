import { describe, expect, it } from "vitest";
import { normalizeStockNotification } from "./notification.helpers";
import type { NotificationItem } from "./notification.types";

const notification: NotificationItem = {
  id: "stock-alert",
  userId: "user",
  type: "stock",
  titleKey: "notification.low_stock_detected_title",
  descriptionKey: "notification.low_stock_detected_description",
  contentValues: { productName: "MAC", stock: 0 },
  actionPath: null,
  isRead: false,
  createdAt: "2026-10-30T00:00:00Z",
};

describe("normalizeStockNotification", () => {
  it.each([0, "0"])("displays out of stock for %s", (stock) => {
    expect(normalizeStockNotification({
      ...notification,
      contentValues: { ...notification.contentValues, stock },
    })).toEqual({
      ...notification,
      contentValues: { ...notification.contentValues, stock },
      titleKey: "notification.out_of_stock_detected_title",
      descriptionKey: "notification.out_of_stock_detected_description",
    });
  });

  it.each([1, "1", "", "unknown"])("preserves the message for %s", (stock) => {
    const input = {
      ...notification,
      contentValues: { ...notification.contentValues, stock },
    };
    expect(normalizeStockNotification(input)).toBe(input);
  });

  it("does not treat a missing stock value as zero", () => {
    const input = { ...notification, contentValues: { productName: "MAC" } };
    expect(normalizeStockNotification(input)).toBe(input);
  });

  it("preserves other notification types", () => {
    const input = { ...notification, type: "order" as const };
    expect(normalizeStockNotification(input)).toBe(input);
  });
});
