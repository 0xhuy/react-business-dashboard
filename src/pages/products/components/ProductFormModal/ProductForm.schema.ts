// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";
import { isProductCategory } from "@/utils/helper";

const requiredNonNegativeNumber = (
  requiredMessage: string,
  invalidMessage: string,
) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : Number(value)),
    z
      .number({ error: requiredMessage })
      .min(0, invalidMessage),
  );

// ===== Schema =====
export const productFormSchema = (t: TFunction) =>
  z.object({
    sku: z.string().trim().min(1, t("products.validation.sku_required")),

    name: z.string().trim().min(1, t("products.validation.name_required")),

    category: z
      .string()
      .trim()
      .min(1, t("products.validation.category_required"))
      .refine(isProductCategory, t("products.validation.category_invalid")),

    price: requiredNonNegativeNumber(
      t("products.validation.price_required"),
      t("products.validation.price_invalid"),
    ),

    stock: requiredNonNegativeNumber(
      t("products.validation.stock_required"),
      t("products.validation.stock_invalid"),
    ),

    description: z.string().trim(),
  });

// ===== Types =====
export type ProductFormSchema = z.infer<ReturnType<typeof productFormSchema>>;
