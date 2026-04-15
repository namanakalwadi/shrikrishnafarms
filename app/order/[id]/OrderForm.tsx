"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { karnatakaDistricts } from "@/data/districts";
import { useCart } from "@/lib/cartContext";
import { supabase } from "@/lib/supabase";

interface Mango {
  id: number;
  name: string;
  price: number;
  hasVariants: boolean;
}

interface Variant {
  id: number;
  box_type: "dozen" | "5kg";
  size: string | null;
  price: number;
  label: string;
}

export default function OrderForm({ mango }: { mango: Mango }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [size, setSize] = useState<"medium" | "large">("medium");
  const [quantity, setQuantity] = useState(1);
  const [district, setDistrict] = useState("Dharwad");
  const [addedToCart, setAddedToCart] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(mango.hasVariants);

  // Fetch variants from Supabase for mangoes that have them
  useEffect(() => {
    if (!mango.hasVariants) return;
    supabase
      .from("product_variants")
      .select("id, box_type, size, price, label")
      .eq("mango_id", mango.id)
      .eq("active", true)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setVariants(data as Variant[]);
        }
        setLoadingVariants(false);
      });
  }, [mango.id, mango.hasVariants]);

  // Get current 5 kg variant based on selected size
  const getSelectedVariant = (): Variant | null => {
    if (!mango.hasVariants || variants.length === 0) return null;
    return variants.find((v) => v.box_type === "5kg" && v.size === size) ?? null;
  };

  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant?.price ?? mango.price;
  const currentLabel = selectedVariant?.label ?? "5 Kg Box";

  const selectedDistrict = karnatakaDistricts.find((d) => d.name === district);
  const deliveryCharge = selectedDistrict?.deliveryCharge ?? 0;
  const mangoTotal = quantity * currentPrice;
  const grandTotal = mangoTotal + deliveryCharge;

  const quantityLabel = "Quantity (boxes)";
  const unitLabel = quantity === 1 ? "box" : "boxes";

  const handleProceed = () => {
    const params = new URLSearchParams({
      mangoId: String(mango.id),
      mangoName: mango.name,
      price: String(currentPrice),
      qty: String(quantity),
      district,
      delivery: String(deliveryCharge),
      total: String(grandTotal),
      boxType: "5kg",
      size: mango.hasVariants ? size : "",
      variantLabel: currentLabel,
    });
    try { sessionStorage.setItem("skf_checkout_token", "1"); } catch {}
    router.push(`/checkout?${params.toString()}`);
  };

  const handleAddToCart = () => {
    addItem({
      mangoId: mango.id,
      mangoName: mango.name,
      price: currentPrice,
      quantity,
      boxType: "5kg",
      size: mango.hasVariants ? size : null,
      variantLabel: currentLabel,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
      <h3 className="text-xl font-black text-stone-900 mb-6">Customise Your Order</h3>

      {/* Size selector — 5 kg box sizes */}
      {mango.hasVariants && !loadingVariants && (
        <div className="mb-6">
          <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
            Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSize("medium")}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                size === "medium"
                  ? "border-amber-600 bg-amber-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <p className="font-black text-stone-900 text-sm">Medium</p>
              <p className="text-stone-400 text-xs mt-0.5">20-24 pieces approx</p>
            </button>
            <button
              type="button"
              onClick={() => setSize("large")}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                size === "large"
                  ? "border-amber-600 bg-amber-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <p className="font-black text-stone-900 text-sm">Large</p>
              <p className="text-stone-400 text-xs mt-0.5">18-20 pieces approx</p>
            </button>
          </div>
        </div>
      )}

      {loadingVariants && (
        <div className="mb-6 text-center text-stone-400 text-sm py-4">Loading options...</div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
          {quantityLabel}
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-lg transition-colors flex items-center justify-center"
          >
            −
          </button>
          <span className="text-2xl font-black text-stone-900 w-10 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-lg transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* District */}
      <div className="mb-6">
        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
          Delivery District (Karnataka)
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {karnatakaDistricts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}{d.deliveryCharge > 0 ? ` (+₹${d.deliveryCharge} delivery)` : " (Free Delivery)"}
            </option>
          ))}
        </select>
      </div>

      {/* Price Breakdown */}
      <div className="bg-stone-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>₹{currentPrice} × {quantity} {unitLabel}</span>
          <span className="font-bold text-stone-800">₹{mangoTotal}</span>
        </div>
        {mango.hasVariants && (
          <div className="text-stone-400 text-xs">{currentLabel}</div>
        )}
        <div className="flex justify-between text-stone-600">
          <span>Delivery to {district}</span>
          <span className="font-bold text-stone-800">
            {deliveryCharge === 0
              ? <span className="text-green-600">Free</span>
              : `₹${deliveryCharge}`}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-stone-200">
          <span className="font-black text-stone-900">Total</span>
          <span className="font-black text-xl text-amber-600">₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={loadingVariants}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider transition-colors"
      >
        Proceed Further →
      </button>

      <button
        onClick={handleAddToCart}
        disabled={loadingVariants}
        className="w-full mt-2 border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-black py-3 rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50"
      >
        {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
      </button>

      <p className="text-center text-stone-400 text-xs mt-3">
        Delivery within Karnataka only · Freshly packed
      </p>
    </div>
  );
}
