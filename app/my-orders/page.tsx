"use client";

import { useState } from "react";

interface OrderItem {
  mango_name: string;
  quantity_dozens: number;
  price_per_dozen: number;
  subtotal: number;
  box_type: string;
  size: string | null;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  district: string;
  delivery_charge: number;
  total_amount: number;
  payment_mode: string;
  status: string;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusMessage: Record<string, string> = {
  pending: "Order placed — we'll confirm it shortly.",
  confirmed: "Confirmed! Your order is being prepared.",
  delivered: "Delivered! Enjoy your mangoes 🥭",
  cancelled: "This order was cancelled.",
};

const STEPS = ["Order Placed", "Confirmed", "Delivered"];
const stepIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  delivered: 2,
  cancelled: -1,
};

export default function MyOrdersPage() {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrders(null);

    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Order History</p>
          <h1 className="text-4xl font-black text-white">My Orders</h1>
          <p className="font-bold text-stone-300 mt-2">Enter your mobile number to view your past orders</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter your 10-digit mobile number"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-colors shrink-0"
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-600 text-sm font-bold bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}

        {/* Results */}
        {orders !== null && (
          <div className="mt-8">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <p className="text-lg font-medium">No orders found for this number.</p>
              </div>
            ) : (
              <div>
                <p className="text-stone-500 text-sm font-medium mb-4">{orders.length} order{orders.length > 1 ? "s" : ""} found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">

                      {/* Top: date + status */}
                      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-stone-100">
                        <div>
                          <p className="font-black text-stone-900 text-sm">
                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-stone-400 text-[11px] font-mono mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="px-4 py-3 space-y-1.5 flex-1">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-stone-700 font-semibold">
                              {item.mango_name}{item.box_type === "5kg" ? ` (5Kg ${item.size})` : ""} × {item.quantity_dozens} {item.box_type === "5kg" ? (item.quantity_dozens === 1 ? "box" : "boxes") : "doz"}
                            </span>
                            <span className="text-stone-500">₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status progress tracker */}
                      {order.status === "cancelled" ? (
                        <div className="px-4 py-3 border-t border-stone-100 bg-red-50">
                          <p className="text-xs font-bold text-red-600">{statusMessage.cancelled}</p>
                        </div>
                      ) : (
                        <div className="px-4 py-3 border-t border-stone-100">
                          <div className="flex items-center gap-0">
                            {STEPS.map((step, i) => {
                              const active = stepIndex[order.status] >= i;
                              return (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-amber-500" : "bg-stone-200"}`} />
                                    <p className={`text-[9px] font-bold mt-1 text-center leading-tight ${active ? "text-amber-600" : "text-stone-300"}`}>{step}</p>
                                  </div>
                                  {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mb-3 mx-1 ${stepIndex[order.status] > i ? "bg-amber-400" : "bg-stone-200"}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-stone-500 font-medium mt-2">{statusMessage[order.status]}</p>
                        </div>
                      )}

                      {/* Bottom: total + delivery */}
                      <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-stone-400 font-medium">{order.district} · {order.delivery_charge === 0 ? "Free delivery" : `+₹${order.delivery_charge}`}</p>
                          <p className="text-[10px] text-stone-400 capitalize">{order.payment_mode === "cod" ? "Cash on Delivery" : "Online"}</p>
                        </div>
                        <span className="font-black text-amber-600 text-base">₹{order.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
