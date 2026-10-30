// ============================================================
// PRODUCTS API
// ============================================================

// ===== Configs =====
import { supabase } from "@/services/supabase";

// ===== Types =====
import type {
  ProductDraft,
  ProductMutationPayload,
  ProductRow,
} from "./product.types";
import { normalizeProductCategory } from "@/utils/helper";
import { PRODUCT_SELECT_COLUMNS } from "@/utils/constants";

const mapProduct = (product: ProductRow): ProductRow => ({
  ...product,
  category: normalizeProductCategory(product.category),
});

const getProducts = async (): Promise<ProductRow[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ProductRow[]).map(mapProduct);
};

const createProduct = async (
  product: ProductMutationPayload,
): Promise<ProductRow> => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select(PRODUCT_SELECT_COLUMNS)
    .single();

  if (error) throw error;

  return mapProduct(data as ProductRow);
};

const updateProduct = async (
  id: string,
  product: ProductMutationPayload,
): Promise<ProductRow> => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select(PRODUCT_SELECT_COLUMNS)
    .single();

  if (error) throw error;

  return mapProduct(data as ProductRow);
};

const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
};

const saveProducts = async (
  products: ProductDraft[],
  deletedIds: string[],
): Promise<ProductRow[]> => {
  await Promise.all(deletedIds.map((id) => deleteProduct(id)));

  await Promise.all(
    products.map(({ id, ...product }) =>
      id ? updateProduct(id, product) : createProduct(product),
    ),
  );

  return getProducts();
};

const productApi = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProducts,
};

export default productApi;
