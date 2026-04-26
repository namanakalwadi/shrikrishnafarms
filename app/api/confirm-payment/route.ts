import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // CSRF protection: validate Origin header with strict comparison
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (!origin || !host) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const formData = await req.formData();
    const orderId = formData.get("orderId") as string;
    const mobile = (formData.get("mobile") as string)?.trim();
    const utrNumber = (formData.get("utrNumber") as string)?.trim();
    const screenshot = formData.get("screenshot") as File | null;

    if (!orderId || !mobile || !utrNumber || !screenshot) {
      return NextResponse.json({ error: "Order ID, mobile number, UTR number and screenshot are required." }, { status: 400 });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
    }

    if (!/^\d{12}$/.test(utrNumber)) {
      return NextResponse.json({ error: "Invalid UTR number. Must be exactly 12 digits." }, { status: 400 });
    }

    const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_MIME.includes(screenshot.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG or WebP images are accepted." }, { status: 400 });
    }

    if (screenshot.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Screenshot must be under 10 MB." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Verify order exists, belongs to the caller, and is pending
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, mobile, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Unable to process payment confirmation." }, { status: 400 });
    }

    if (order.mobile !== mobile) {
      return NextResponse.json({ error: "Unable to process payment confirmation." }, { status: 400 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ error: "Unable to process payment confirmation." }, { status: 400 });
    }

    // Upload screenshot to Supabase Storage
    const MIME_TO_EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const ext = MIME_TO_EXT[screenshot.type] ?? "jpg";
    const fileName = `${orderId}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    // Validate file magic bytes to prevent spoofed Content-Type uploads
    const isValidMagic = (buf: Buffer): boolean => {
      if (buf.length < 12) return false;
      // JPEG: FF D8 FF
      if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
      // PNG: 89 50 4E 47
      if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
      // WebP: RIFF....WEBP
      if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
          buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return true;
      return false;
    };

    if (!isValidMagic(buffer)) {
      return NextResponse.json({ error: "File content does not match a valid image format." }, { status: 400 });
    }

    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, { contentType: screenshot.type, upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return NextResponse.json({ error: "Failed to upload screenshot." }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName);

    // Save to payment_confirmations table
    const { error: dbError } = await supabase
      .from("payment_confirmations")
      .insert([{ order_id: orderId, utr_number: utrNumber, screenshot_url: urlData.publicUrl }]);

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      return NextResponse.json({ error: "Failed to save payment confirmation." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
