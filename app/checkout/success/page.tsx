"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId") ?? "";

  const [orderData, setOrderData] = useState<{
    payment: string; name: string; mobile: string; total: string; itemCount: number;
  }>({ payment: "cod", name: "Customer", mobile: "", total: "", itemCount: 1 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("skf_order_success");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrderData({
          payment: parsed.payment ?? "cod",
          name: parsed.name ?? "Customer",
          mobile: parsed.mobile ?? "",
          total: String(parsed.total ?? ""),
          itemCount: Number(parsed.itemCount ?? 1),
        });
        localStorage.removeItem("skf_order_success");
      }
    } catch {}
  }, []);

  const { payment, name, mobile, total, itemCount } = orderData;
  const isOnline = payment === "online";
  const [countdown, setCountdown] = useState(5);

  // 5-second redirect to /varieties (only for COD)
  useEffect(() => {
    if (isOnline) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) clearInterval(interval);
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline && countdown <= 0) {
      router.push("/varieties");
    }
  }, [countdown, isOnline, router]);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className={`py-14 px-4 ${isOnline ? "bg-stone-900" : "bg-amber-600"}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isOnline ? "bg-amber-600" : "bg-white/20"}`}>
            <span className="text-white text-2xl font-black">{isOnline ? "₹" : "✓"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            {isOnline ? "Complete Your Payment" : "Order Placed!"}
          </h1>
          <p className="font-bold text-white/80 mt-2">
            {isOnline
              ? "Scan the QR code below to pay and confirm your order"
              : `Thank you, ${name}! We'll call you soon to confirm.`}
          </p>
          {orderId && (
            <p className="text-white/60 text-xs mt-3 font-mono">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>
          )}
        </div>
      </section>

      <section className="py-12 px-4 max-w-2xl mx-auto">

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6 shadow-sm">
          <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Order Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Items ordered</span>
              <span className="font-black text-stone-900">{itemCount} {itemCount === 1 ? "variety" : "varieties"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Name</span>
              <span className="font-black text-stone-900">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Mobile</span>
              <span className="font-black text-stone-900">{mobile}</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-2 mt-2">
              <span className="font-black text-stone-900">Total</span>
              <span className="font-black text-xl text-amber-600">₹{total}</span>
            </div>
          </div>
        </div>

        {isOnline ? (
          <div className="space-y-5">
            {/* QR code */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm text-center">
              <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Scan & Pay</p>
              <div className="w-52 h-52 mx-auto bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/QR-Code.jpeg"
                  alt="UPI QR Code"
                  width={200}
                  height={200}
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <p className="text-stone-500 text-sm mt-4 font-medium">
                Pay <span className="font-black text-stone-900">₹{total}</span> via any UPI app
              </p>
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">For any queries, Contact Us</p>
              <div className="flex justify-around text-center">
                <div>
                  <p className="font-black text-stone-900 text-base">9448822711</p>
                  <p className="text-stone-500 text-xs mt-0.5">Subhas Akalwadi</p>
                </div>
                <div className="w-px bg-stone-100" />
                <div>
                  <p className="font-black text-stone-900 text-base">8431309384</p>
                  <p className="text-stone-500 text-xs mt-0.5">Naman Akalwadi</p>
                </div>
                <div className="w-px bg-stone-100" />
                <div>
                  <p className="font-black text-stone-900 text-base">9448133699</p>
                  <p className="text-stone-500 text-xs mt-0.5">Deepak Akalwadi</p>
                </div>
              </div>
            </div>

            {/* Native confirm payment */}
            <button
              type="button"
              onClick={() => {
                try { sessionStorage.setItem("skf_confirm_payment", JSON.stringify({ total, mobile })); } catch {}
                router.replace(`/checkout/confirm-payment?orderId=${orderId}`);
              }}
              className="flex items-center justify-center w-full bg-stone-900 hover:bg-stone-800 text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-colors"
            >
              Confirm Payment →
            </button>
            <p className="text-center text-stone-400 text-xs">
              Enter your UTR number and upload the payment screenshot to confirm.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="font-black text-amber-800 mb-2">What happens next?</p>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex gap-2"><span className="font-black">1.</span> Our team will call you on <strong>{mobile}</strong> to confirm.</li>
                <li className="flex gap-2"><span className="font-black">2.</span> Mangoes will be packed fresh and dispatched to your address.</li>
                <li className="flex gap-2"><span className="font-black">3.</span> Pay <strong>₹{total}</strong> in cash when you receive the delivery.</li>
              </ul>
            </div>

            {/* Plain contact numbers */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">Our Delivery Team</p>
              <div className="flex justify-around text-center">
                <div>
                  <p className="font-black text-stone-900 text-base">9448822711</p>
                  <p className="text-stone-500 text-xs mt-0.5">Subhas Akalwadi</p>
                </div>
                <div className="w-px bg-stone-100" />
                <div>
                  <p className="font-black text-stone-900 text-base">8431309384</p>
                  <p className="text-stone-500 text-xs mt-0.5">Naman Akalwadi</p>
                </div>
                <div className="w-px bg-stone-100" />
                <div>
                  <p className="font-black text-stone-900 text-base">9448133699</p>
                  <p className="text-stone-500 text-xs mt-0.5">Deepak Akalwadi</p>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <p className="text-center text-stone-400 text-sm">
              Redirecting to varieties in <span className="font-black text-amber-600">{countdown}s</span>…
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/my-orders" className="text-amber-600 hover:text-amber-700 font-bold text-sm underline">
            View My Orders
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-stone-500">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
