import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, created_at, district, delivery_charge, total_amount, payment_mode, status, customer_name, order_items(mango_name, quantity_dozens, price_per_dozen, subtotal, box_type, size)")
      .eq("mobile", mobile)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("My orders error:", JSON.stringify(error));
      return NextResponse.json({ error: "Failed to retrieve orders." }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("My orders API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
