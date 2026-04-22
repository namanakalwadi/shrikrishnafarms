"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";

interface CartItem { mangoId: number; mangoName: string; price: number; quantity: number; boxType: string; size: string | null; variantLabel: string; }
interface PendingCart { items: CartItem[]; district: string; deliveryCharge: number; mangoSubtotal: number; grandTotal: number; }

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const isCartSource = params.get("source") === "cart";


  // Single-item source (from URL params)
  const mangoId = Number(params.get("mangoId"));
  const mangoName = params.get("mangoName") ?? "";
  const price = Number(params.get("price"));
  const qty = Number(params.get("qty"));
  const district = params.get("district") ?? "";
  const delivery = Number(params.get("delivery"));
  const total = Number(params.get("total"));
  const boxType = params.get("boxType") ?? "dozen";
  const size = params.get("size") || null;
  const variantLabel = params.get("variantLabel") ?? "1 Dozen";

  // Cart source (from localStorage)
  const [pendingCart, setPendingCart] = useState<PendingCart | null>(null);

  useEffect(() => {
    if (isCartSource) {
      try {
        const saved = localStorage.getItem("skf_pending_cart");
        if (saved) setPendingCart(JSON.parse(saved));
      } catch {}
    }
  }, [isCartSource]);

  // Computed display values
  const displayDistrict = isCartSource ? (pendingCart?.district ?? "") : district;
  const displayDelivery = isCartSource ? (pendingCart?.deliveryCharge ?? 0) : delivery;
  const displayTotal = isCartSource ? (pendingCart?.grandTotal ?? 0) : total;
  const displayItems = isCartSource
    ? (pendingCart?.items ?? []).map((i) => ({
        name: i.mangoName,
        qty: i.quantity,
        subtotal: i.price * i.quantity,
        variantLabel: i.variantLabel ?? "1 Dozen",
        boxType: i.boxType ?? "dozen",
      }))
    : [{ name: mangoName, qty, subtotal: price * qty, variantLabel, boxType }];

  const COD_DISTRICTS = ["Dharwad", "Hubballi"];
  const codAllowed = COD_DISTRICTS.includes(displayDistrict);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [house, setHouse] = useState("");
  const [road, setRoad] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Karnataka");
  const [landmark, setLandmark] = useState("");
  const [payment, setPayment] = useState<"cod" | "online">("cod");

  // If district doesn't support COD, switch to online
  useEffect(() => {
    if (!codAllowed) setPayment("online");
  }, [codAllowed]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prevent stale forward-button navigation to checkout
  const tokenChecked = useRef(false);
  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    if (tokenChecked.current) return;
    tokenChecked.current = true;
    const t = sessionStorage.getItem("skf_checkout_token");
    if (!t) { router.back(); return; }
    sessionStorage.removeItem("skf_checkout_token");
    setTokenValid(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    const composedAddress = [
      house.trim(),
      road.trim(),
      landmark.trim() ? `Near ${landmark.trim()}` : "",
      `${city.trim()}, ${state} - ${pincode}`,
    ].filter(Boolean).join(", ");

    // Build items array for API
    const items = isCartSource
      ? (pendingCart?.items ?? []).map((i) => ({
          mango_id: i.mangoId,
          mango_name: i.mangoName,
          quantity_dozens: i.quantity,
          price_per_dozen: i.price,
          subtotal: i.price * i.quantity,
          box_type: i.boxType ?? "dozen",
          size: i.size ?? null,
        }))
      : [{ mango_id: mangoId, mango_name: mangoName, quantity_dozens: qty, price_per_dozen: price, subtotal: price * qty, box_type: boxType, size }];

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          mobile,
          address: composedAddress,
          district: displayDistrict,
          delivery_charge: displayDelivery,
          total_amount: displayTotal,
          payment_mode: payment,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      // Clear cart & pending cart after successful order
      clearCart();
      localStorage.removeItem("skf_pending_cart");

      localStorage.setItem("skf_order_success", JSON.stringify({
        orderId: data.orderId,
        payment,
        name,
        mobile,
        total: displayTotal,
        itemCount: items.length,
      }));
      router.replace(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) return null;

  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            {isCartSource ? (
              <Link href="/cart" className="hover:text-amber-400">Cart</Link>
            ) : (
              <><Link href="/varieties" className="hover:text-amber-400">Varieties</Link>
              {" "}&rsaquo;{" "}
              <Link href={`/order/${mangoId}`} className="hover:text-amber-400">Order</Link></>
            )}
            {" "}&rsaquo; Checkout
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white">Your Details</h1>
          <p className="font-bold text-stone-300 mt-1">Almost there — just a few details</p>
        </div>
      </section>

      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-stone-900 rounded-2xl p-6 text-white sticky top-24">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4">Order Summary</p>
              <div className="space-y-1.5">
                {displayItems.map((item, i) => {
                  const unitLabel = item.boxType === "5kg" ? (item.qty === 1 ? "box" : "boxes") : "doz";
                  return (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-stone-300">{item.name} × {item.qty} {unitLabel}</span>
                      <span className="text-stone-300">₹{item.subtotal}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-sm border-t border-stone-700 pt-4">
                <div className="flex justify-between text-stone-400">
                  <span>Delivery to {displayDistrict}</span>
                  <span>{displayDelivery === 0 ? <span className="text-green-400">Free</span> : `₹${displayDelivery}`}</span>
                </div>
                <div className="flex justify-between font-black text-white border-t border-stone-700 pt-2 text-base">
                  <span>Total</span>
                  <span className="text-amber-400">₹{displayTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">Mobile Number *</label>
              <input type="tel" required maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <p className="text-stone-400 text-xs mt-1">Used to confirm and track your order</p>
            </div>

            <div className="pt-2">
              <p className="text-sm font-black text-stone-900 mb-3 flex items-center gap-2">
                <span className="text-amber-600">📍</span> Delivery Address
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">House no. / Building name *</label>
                  <input type="text" required maxLength={120} value={house} onChange={(e) => setHouse(e.target.value)} placeholder="e.g. 123, Krishna Nivas"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">Road name / Area / Colony *</label>
                  <input type="text" required maxLength={150} value={road} onChange={(e) => setRoad(e.target.value)} placeholder="e.g. MG Road, Saraswathpur"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">Pincode *</label>
                  <input required type="text" inputMode="numeric" maxLength={6} value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit pincode"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">City *</label>
                    <input type="text" required maxLength={60} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Dharwad"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">State *</label>
                    <select required value={state} onChange={(e) => setState(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Goa">Goa</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">Nearby Famous Place / Shop / School (optional)</label>
                  <input type="text" maxLength={120} value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near Vidya School"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-3">Payment Mode *</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => codAllowed && setPayment("cod")}
                  disabled={!codAllowed}
                  title={!codAllowed ? "Cash on Delivery available only for Dharwad & Hubballi" : undefined}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    !codAllowed
                      ? "border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed"
                      : payment === "cod"
                      ? "border-amber-600 bg-amber-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}>
                  <p className="font-black text-stone-900 text-sm">Cash on Delivery</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {codAllowed ? "Pay when you receive" : "Dharwad & Hubballi only"}
                  </p>
                </button>
                <button type="button" onClick={() => setPayment("online")}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${payment === "online" ? "border-amber-600 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                  <p className="font-black text-stone-900 text-sm">Online Payment</p>
                  <p className="text-stone-400 text-xs mt-0.5">UPI / QR code</p>
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm font-bold bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-colors">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            <p className="text-center text-stone-400 text-xs">By placing this order you agree to be contacted by our delivery team.</p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-stone-500">Loading...</p></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
