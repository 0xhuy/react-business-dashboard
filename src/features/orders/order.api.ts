import { supabase } from "@/services/supabase";
import type { ProductRow } from "@/features/products/product.types";
import type {
  PurchaseOrderMutationPayload,
  PurchaseOrderRow,
  PurchaseOrderStatus,
} from "./order.types";

const ORDER_SELECT = `
  id,
  order_number,
  supplier,
  order_date,
  status,
  notes,
  purchase_order_items (
    id,
    product_id,
    product_name,
    quantity,
    unit_price,
    products (sku, name)
  )
`;

type OrderRecord = Record<string, unknown> & {
  purchase_order_items?: Array<Record<string, unknown>>;
};

const mapOrder = (record: OrderRecord): PurchaseOrderRow => ({
  id: String(record.id),
  poNumber: String(record.order_number),
  supplier: String(record.supplier),
  orderDate: String(record.order_date),
  status: String(record.status) as PurchaseOrderStatus,
  note: String(record.notes ?? ""),
  items: (record.purchase_order_items ?? []).map((item) => {
    const product = item.products as Pick<ProductRow, "sku" | "name"> | null;

    return {
      id: String(item.id),
      productId: item.product_id ? String(item.product_id) : null,
      productSku: product?.sku ?? "",
      productName: String(item.product_name ?? product?.name ?? ""),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
    };
  }),
});

const getPurchaseOrders = async (): Promise<PurchaseOrderRow[]> => {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(ORDER_SELECT)
    .order("order_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as OrderRecord[]).map(mapOrder);
};

const getProductsBySku = async (skus: string[]): Promise<ProductRow[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, sku, name, category, price, stock, description")
    .in("sku", skus);

  if (error) throw error;
  return (data ?? []) as ProductRow[];
};

const replaceOrderItems = async (
  orderId: string,
  payload: PurchaseOrderMutationPayload,
): Promise<void> => {
  const products = await getProductsBySku(
    payload.items.map((item) => item.productSku),
  );
  const productsBySku = new Map(products.map((product) => [product.sku, product]));

  const { error: deleteError } = await supabase
    .from("purchase_order_items")
    .delete()
    .eq("purchase_order_id", orderId);
  if (deleteError) throw deleteError;

  const items = payload.items.map((item) => {
    const product = productsBySku.get(item.productSku);
    return {
      purchase_order_id: orderId,
      product_id: product?.id ?? null,
      product_name: product?.name ?? item.productSku,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    };
  });

  const { error } = await supabase.from("purchase_order_items").insert(items);
  if (error) throw error;
};

const createPurchaseOrder = async (
  payload: PurchaseOrderMutationPayload,
): Promise<PurchaseOrderRow[]> => {
  const { data, error } = await supabase
    .from("purchase_orders")
    .insert({
      order_number: `PO-${Date.now()}`,
      supplier: payload.supplier.trim(),
      order_date: payload.orderDate,
      status: payload.status,
      notes: payload.note.trim(),
    })
    .select("id")
    .single();

  if (error) throw error;
  await replaceOrderItems(String(data.id), payload);
  return getPurchaseOrders();
};

const updatePurchaseOrder = async (
  id: string,
  payload: PurchaseOrderMutationPayload,
): Promise<PurchaseOrderRow[]> => {
  const { error } = await supabase
    .from("purchase_orders")
    .update({
      supplier: payload.supplier.trim(),
      order_date: payload.orderDate,
      status: payload.status,
      notes: payload.note.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  await replaceOrderItems(id, payload);
  return getPurchaseOrders();
};

const deletePurchaseOrder = async (id: string): Promise<string> => {
  const { error } = await supabase.from("purchase_orders").delete().eq("id", id);
  if (error) throw error;
  return id;
};

export default {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
