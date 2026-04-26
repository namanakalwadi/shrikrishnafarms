import { createServiceClient } from "./supabase";

/** Server-side fetch of inventory map: { mangoId: in_stock }. Used by all pages that render mango cards. */
export async function getInventoryMap(): Promise<Record<number, boolean>> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("inventory").select("mango_id, in_stock");
  if (error) console.error("Inventory fetch error:", error.message);
  const map: Record<number, boolean> = {};
  data?.forEach((row) => { map[row.mango_id] = row.in_stock; });
  return map;
}
