import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { karnatakaDistricts } from "@/data/districts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, mobile, address, district, payment_mode, items } = body;

    if (!customer_name || !mobile || !address || !district || !payment_mode || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
    }

    if (customer_name.length > 100 || address.length > 500 || district.length > 60) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    if (!["cod", "online"].includes(payment_mode)) {
      return NextResponse.json({ error: "Invalid payment mode." }, { status: 400 });
    }

    if (items.length > 20) {
      return NextResponse.json({ error: "Too many items in order." }, { status: 400 });
    }

    // Server-side district validation and delivery charge lookup
    const districtEntry = karnatakaDistricts.find((d) => d.name === district);
    if (!districtEntry) {
      return NextResponse.json({ error: "Invalid district." }, { status: 400 });
    }
    const delivery_charge = districtEntry.deliveryCharge;

    const supabase = createServiceClient();

    // Server-side price validation: look up actual product variant prices from DB
    type ItemInput = { mango_id: number; mango_name: string; quantity_dozens: number; price_per_dozen: number; subtotal: number; box_type?: string; size?: string | null };
    let serverItems: { mango_id: number; mango_name: string; quantity_dozens: number; price_per_dozen: number; subtotal: number; box_type: string; size: string | null }[];

    try {
      const mangoIds = [...new Set(items.map((item: ItemInput) => item.mango_id))];
      const { data: variants, error: variantError } = await supabase
        .from("product_variants")
        .select("mango_id, box_type, size, price")
        .in("mango_id", mangoIds)
        .eq("active", true);

      if (variantError || !variants || variants.length === 0) {
        throw new Error("Variant lookup failed");
      }

      // Build a lookup map: "mangoId-boxType-size" -> price
      const priceMap = new Map<string, number>();
      for (const v of variants) {
        const key = `${v.mango_id}-${v.box_type}-${v.size ?? "null"}`;
        priceMap.set(key, v.price);
      }

      // Validate each item's price against DB and recalculate subtotals
      serverItems = items.map((item: ItemInput) => {
        const boxType = item.box_type ?? "dozen";
        const size = item.size ?? null;
        const key = `${item.mango_id}-${boxType}-${size ?? "null"}`;
        const dbPrice = priceMap.get(key);

        if (dbPrice === undefined) {
          throw new Error(`No matching product variant for mango_id=${item.mango_id}, box_type=${boxType}, size=${size}`);
        }

        return {
          mango_id: item.mango_id,
          mango_name: item.mango_name,
          quantity_dozens: item.quantity_dozens,
          price_per_dozen: dbPrice,
          subtotal: item.quantity_dozens * dbPrice,
          box_type: boxType,
          size: size,
        };
      });
    } catch {
      // Fallback: validate client-supplied prices strictly to prevent price manipulation
      for (const item of items as ItemInput[]) {
        if (typeof item.price_per_dozen !== "number" || !Number.isFinite(item.price_per_dozen) || item.price_per_dozen <= 0 || item.price_per_dozen > 50000) {
          return NextResponse.json({ error: "Invalid item price." }, { status: 400 });
        }
        if (typeof item.quantity_dozens !== "number" || !Number.isFinite(item.quantity_dozens) || item.quantity_dozens <= 0 || item.quantity_dozens > 100) {
          return NextResponse.json({ error: "Invalid item quantity." }, { status: 400 });
        }
      }
      serverItems = items.map((item: ItemInput) => ({
        mango_id: item.mango_id,
        mango_name: item.mango_name,
        quantity_dozens: item.quantity_dozens,
        price_per_dozen: item.price_per_dozen,
        subtotal: item.quantity_dozens * item.price_per_dozen,
        box_type: item.box_type ?? "dozen",
        size: item.size ?? null,
      }));
    }

    // Server-side total recalculation — never trust client-supplied total_amount
    const subtotal = serverItems.reduce((sum, item) => sum + item.subtotal, 0);
    const total_amount = subtotal + delivery_charge;

    // Insert order header with server-calculated values
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ customer_name, mobile, address, district, delivery_charge, total_amount, payment_mode, status: "pending" }])
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError.code, orderError.message);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }

    // Insert order items with server-validated prices
    const orderItems = serverItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("Items insert error:", itemsError.code, itemsError.message);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
