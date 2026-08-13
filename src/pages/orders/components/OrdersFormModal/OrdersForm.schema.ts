// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Others =====
import { OrderStatusEnum } from "@/utils/enum";

// ===== Schema =====
export const orderFormSchema = (t: TFunction) =>
  z.object({
    supplier: z.string().trim().min(1, t("common.required")),
    orderDate: z.string().trim().min(1, t("common.required")),
    status: z.enum(OrderStatusEnum),
    note: z.string().trim(),
    items: z
      .array(
        z.object({
          productSku: z.string().trim().min(1, t("common.required")),
          quantity: z.coerce.number().min(1, t("common.required")),
          unitPrice: z.coerce.number().min(0, t("common.required")),
        }),
      )
      .min(1, t("common.required")),
  });

// ===== Types =====
export type OrderFormSchema = z.infer<ReturnType<typeof orderFormSchema>>;
