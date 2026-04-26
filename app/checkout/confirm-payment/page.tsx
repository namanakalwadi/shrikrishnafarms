"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ConfirmPaymentForm() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId") ?? "";
  const [total, setTotal] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("skf_confirm_payment");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTotal(String(parsed.total ?? ""));
        setMobile(String(parsed.mobile ?? ""));
        sessionStorage.removeItem("skf_confirm_payment");
      }
    } catch {}
  }, []);

  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      setError("Screenshot must be under 10 MB.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!utr) { setError("Please enter your UTR number."); return; }
    if (!/^\d{12}$/.test(utr)) { setError("UTR number must be exactly 12 digits."); return; }
    if (!file) { setError("Please upload your payment screenshot."); return; }
    if (!orderId) { setError("Order ID missing. Please go back and try again."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("mobile", mobile);
      formData.append("utrNumber", utr);
      formData.append("screenshot", file);

      const res = await fetch("/api/confirm-payment", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="min-h-screen bg-stone-50">
        <section className="bg-amber-600 py-14 px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-black">✓</span>
            </div>
            <h1 className="text-3xl font-black text-white">Payment Submitted!</h1>
            <p className="font-bold text-white/80 mt-2">
              We have received your payment details and will verify shortly.
            </p>
          </div>
        </section>
        <section className="py-12 px-4 max-w-xl mx-auto text-center space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="font-black text-amber-800 mb-1">What happens next?</p>
            <p className="text-amber-700 text-sm">Our team will verify your payment and confirm your order. We will contact you on <strong>{mobile}</strong>.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/my-orders" className="bg-stone-900 text-white font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-stone-800 transition-colors">
              My Orders
            </Link>
            <Link href="/varieties" className="border-2 border-stone-900 text-stone-900 font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-all">
              Browse More
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-14 px-4">
        <div className="max-w-xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Link href="/checkout/success" className="hover:text-amber-400">Order</Link> &rsaquo; Confirm Payment
          </p>
          <h1 className="text-3xl font-black text-white">Confirm Your Payment</h1>
          <p className="font-bold text-stone-300 mt-1">Enter your UPI UTR number and upload the payment screenshot</p>
        </div>
      </section>

      <section className="py-12 px-4 max-w-xl mx-auto">

        {/* Order reference */}
        <div className="bg-stone-50 rounded-xl px-5 py-4 mb-7 flex justify-between items-center text-sm">
          <span className="text-stone-500 font-medium">Amount to pay</span>
          <span className="font-black text-amber-600 text-xl">₹{total}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* UTR Number */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">
              UTR / Transaction Reference Number *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="e.g. 421234567890"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-stone-400 text-xs mt-1">
              Find this in your UPI app under transaction history (exactly 12 digits)
            </p>
          </div>

          {/* Screenshot upload */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-1.5">
              Payment Screenshot *
            </label>

            {preview ? (
              <div className="relative">
                <div className="relative w-full h-56 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <Image src={preview} alt="Payment screenshot" fill className="object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="mt-2 text-xs text-stone-400 hover:text-red-500 font-bold transition-colors underline"
                >
                  Remove and upload a different image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl py-10 flex flex-col items-center gap-2 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-stone-300 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-stone-400 group-hover:text-amber-600 text-sm font-bold transition-colors">Tap to upload screenshot</span>
                <span className="text-stone-300 text-xs">JPG, PNG, WEBP — max 10 MB</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-bold bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-colors"
          >
            {loading ? "Submitting..." : "Submit Payment Confirmation"}
          </button>

          <p className="text-center text-stone-400 text-xs">
            Your payment will be verified by our team within a few hours.
          </p>
        </form>
      </section>
    </main>
  );
}

export default function ConfirmPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-stone-500">Loading...</p></div>}>
      <ConfirmPaymentForm />
    </Suspense>
  );
}
