"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, cartKey } from "@/lib/cartContext";
import { karnatakaDistricts } from "@/data/districts";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [district, setDistrict] = useState("Dharwad");

  const selectedDistrict = karnatakaDistricts.find((d) => d.name === district)!;
  const deliveryCharge = selectedDistrict?.deliveryCharge ?? 0;
  const mangoSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const grandTotal = mangoSubtotal + deliveryCharge;

  const handleProceed = () => {
    const pending = { items, district, deliveryCharge, mangoSubtotal, grandTotal };
    localStorage.setItem("skf_pending_cart", JSON.stringify(pending));
    try { sessionStorage.setItem("skf_checkout_token", "1"); } catch {}
    router.push("/checkout?source=cart");
  };

  if (items.length === 0) {
    return (
      <main>
        <section className="bg-stone-900 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black text-white">Your Cart</h1>
          </div>
        </section>
        <section className="py-20 px-4 max-w-3xl mx-auto text-center">
          <p className="text-stone-400 text-lg font-medium">Your cart is empty.</p>
          <Link href="/varieties" className="inline-block mt-6 bg-amber-600 text-white font-black px-8 py-3 rounded-xl hover:bg-amber-700 transition-colors text-sm uppercase tracking-wider">
            Browse Varieties
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-stone-900 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-white">Your Cart</h1>
          <p className="font-bold text-stone-300 mt-1">{items.length} {items.length === 1 ? "item" : "items"} selected</p>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

          {/* Items list */}
          <div className="md:col-span-3 space-y-4">
            {items.map((item) => {
              const key = cartKey(item);
              const unitLabel = item.boxType === "5kg" ? (item.quantity === 1 ? "box" : "boxes") : "doz";
              return (
                <div key={key} className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-stone-900">{item.mangoName}</h3>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {item.variantLabel} · ₹{item.price} per {item.boxType === "5kg" ? "box" : "dozen"}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-black text-stone-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="text-base font-black text-stone-900 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-black text-stone-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-black text-amber-600 text-base w-20 text-right shrink-0">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeItem(key)}
                    className="text-stone-300 hover:text-red-500 transition-colors shrink-0 text-lg leading-none"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-stone-400 hover:text-red-500 text-xs font-bold transition-colors underline"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <div className="bg-stone-900 rounded-2xl p-6 text-white sticky top-24">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4">Order Summary</p>

              {/* District selector */}
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5">
                Delivery District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-5"
              >
                {karnatakaDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}{d.deliveryCharge > 0 ? ` (+₹${d.deliveryCharge})` : " (Free)"}
                  </option>
                ))}
              </select>

              <div className="space-y-2 text-sm border-t border-stone-700 pt-4">
                {items.map((i) => (
                  <div key={cartKey(i)} className="flex justify-between text-stone-400">
                    <span>{i.mangoName} × {i.quantity}</span>
                    <span>₹{i.price * i.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-stone-400">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span className="text-green-400">Free</span> : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-black text-white border-t border-stone-700 pt-2 text-base">
                  <span>Total</span>
                  <span className="text-amber-400">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider transition-colors"
              >
                Proceed Further →
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
