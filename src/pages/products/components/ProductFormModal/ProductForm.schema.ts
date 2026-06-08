// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Schema =====
export const productFormSchema = (t: TFunction) =>
  z.object({
    sku: z.string().trim().min(1, t("products.validation.sku_required")),

    name: z.string().trim().min(1, t("products.validation.name_required")),

    category: z
      .string()
      .trim()
      .min(1, t("products.validation.category_required")),

    price: z.coerce.number().min(0, t("products.validation.price_invalid")),

    stock: z.coerce.number().min(0, t("products.validation.stock_invalid")),

    description: z
      .string()
      .trim()
      .min(1, t("products.validation.description_required")),
  });

// ===== Types =====
export type ProductFormSchema = z.infer<ReturnType<typeof productFormSchema>>;
