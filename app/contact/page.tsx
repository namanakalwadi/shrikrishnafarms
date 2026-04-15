import Link from "next/link";
import FadeInUp from "@/components/FadeInUp";

export default function ContactPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Reach Us</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Contact Us</h1>
          <p className="font-bold text-stone-300 mt-3 text-lg max-w-xl">
            For orders, bulk purchases, or any queries — we are always happy to help.
          </p>
        </div>
      </section>

      {/* Single Contact Box */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <FadeInUp>
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Fruit Delivery Service</p>
          <h2 className="text-2xl font-black text-stone-900 mb-8">Get in Touch</h2>
          <div className="bg-stone-900 rounded-2xl p-8 text-white">
            <div className="space-y-6">
              <div className="pb-6 border-b border-stone-700">
                <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Delivery Contacts</p>
                <a href="tel:9448822711" className="flex items-center gap-3 text-stone-200 hover:text-amber-400 transition-colors mb-3">
                  <span className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="font-black text-base">9448822711</p>
                    <p className="text-stone-400 text-xs">Subhas Akalwadi · Call or WhatsApp</p>
                  </div>
                </a>
                <a href="tel:8431309384" className="flex items-center gap-3 text-stone-200 hover:text-amber-400 transition-colors">
                  <span className="w-8 h-8 bg-stone-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="font-black text-base">8431309384</p>
                    <p className="text-stone-400 text-xs">Naman Akalwadi · Call or WhatsApp</p>
                  </div>
                </a>
              </div>

              <div className="pb-6 border-b border-stone-700">
                <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Our Location</p>
                <p className="text-stone-200 font-bold leading-relaxed">
                  Near Nuggikeri Hanuman Temple,<br />
                  Kalaghatgi Road, Dharwad, Karnataka
                </p>
              </div>

              <div>
                <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Season</p>
                <p className="text-stone-200 font-bold">April – August</p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </section>

      {/* CTA */}
      <section className="pb-16 px-4 max-w-3xl mx-auto">
        <FadeInUp>
          <div className="bg-amber-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-black text-white">Ready to Order?</h2>
            <p className="font-bold text-white mt-2">Farm fresh mangoes from Dharwad to your door</p>
            <Link
              href="/varieties"
              className="inline-block mt-5 bg-white text-amber-700 font-black px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors text-sm uppercase tracking-wider"
            >
              Place Your Order
            </Link>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
}
