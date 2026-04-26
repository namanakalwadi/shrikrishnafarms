import Link from "next/link";
import Image from "next/image";
import MangoCard from "@/components/MangoCard";
import FadeInUp from "@/components/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import mangoes from "@/data/mangoes.json";

const stats = [
  { value: "5+", label: "Acres of Orchard" },
  { value: "4+", label: "Mango Varieties" },
  { value: "3rd", label: "Generation Farm" },
  { value: "1000+", label: "Happy Customers" },
];

const whyUs = [
  { title: "Direct from Farm", desc: "No middlemen. Mangoes go straight from our orchard to your home.", icon: "🌿" },
  { title: "Hand Picked", desc: "Every mango is hand-selected at peak ripeness for the best flavour.", icon: "👐" },
  { title: "Karnataka Delivery", desc: "We deliver carefully packaged mangoes across all districts of Karnataka.", icon: "🚚" },
  { title: "Trusted Quality", desc: "Premium grade, naturally ripened — no artificial ripening agents.", icon: "✓" },
];

export default function Home() {
  const featured = mangoes.slice(0, 3);

  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero-image.jpeg"
          alt="Akalwadi's Shri Krishna Farms — fresh Dharwad mangoes"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Shade overlay — darker on left (text side), softer on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/50" />

        {/* Content */}
        <div className="relative z-10 w-full px-8 md:px-16 py-20">
          <div className="max-w-2xl">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.25em] mb-5">
              Dharwad, Karnataka • Est. 3 Generations
            </p>

            <h1 className="text-white font-black italic text-4xl md:text-5xl leading-tight drop-shadow-lg">
              Akalwadi's
            </h1>
            <h2 className="text-white font-black uppercase text-5xl md:text-7xl leading-none tracking-tight mt-1 drop-shadow-lg">
              Shri Krishna<br />Farms
            </h2>

            <div className="w-14 h-0.5 bg-amber-500 my-7" />

            <p className="text-stone-100 text-base md:text-lg leading-relaxed max-w-md drop-shadow-md">
              We grow farm-fresh organic mangoes that are naturally ripened and completely chemical-free. Cultivated with care using sustainable practices, each mango is pure, juicy, and full of authentic flavor—just the way nature intended.
            </p>

            <div className="mt-9 flex gap-3 flex-wrap">
              <Link
                href="/varieties"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-7 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors shadow-lg"
              >
                Browse Varieties
              </Link>
              <Link
                href="/varieties"
                className="border border-white/50 hover:border-white text-white font-bold px-7 py-3 rounded-lg text-sm uppercase tracking-wider transition-all backdrop-blur-sm bg-white/10 hover:bg-white/20"
              >
                Order Now
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20 max-w-md">
              <p className="text-stone-300 text-xs mb-2 uppercase tracking-widest">Delivery Contact</p>
              <div className="flex gap-6 flex-wrap">
                <a href="tel:9448822711" className="text-stone-100 hover:text-amber-400 text-sm font-semibold transition-colors">
                  Subhas Akalwadi · 9448822711
                </a>
                <a href="tel:8431309384" className="text-stone-100 hover:text-amber-400 text-sm font-semibold transition-colors">
                  Naman Akalwadi · 8431309384
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="bg-amber-600 py-4">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-amber-500">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center px-4 py-3">
              <p className="text-white text-2xl font-black">{value}</p>
              <p className="text-amber-100 text-xs font-medium mt-0.5 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Varieties ───────────────────────────── */}
      <section className="py-10 md:py-20 px-4 max-w-6xl mx-auto">
        <FadeInUp className="mb-12">
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Our Produce</p>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900">Featured Varieties</h2>
          <p className="font-bold text-stone-900 mt-2 text-lg">Premium mangoes, grown with care in Karnataka</p>
        </FadeInUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((mango) => (
            <StaggerItem key={mango.id}>
              <MangoCard {...mango} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeInUp className="mt-10">
          <Link
            href="/varieties"
            className="inline-block border-2 border-amber-600 text-amber-700 font-bold px-8 py-3 rounded-lg hover:bg-amber-600 hover:text-white transition-all text-sm uppercase tracking-wider"
          >
            View All 4 Varieties →
          </Link>
        </FadeInUp>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="bg-stone-50 py-10 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInUp className="mb-12">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900">The Shri Krishna Difference</h2>
          </FadeInUp>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {whyUs.map(({ title, desc, icon }) => (
              <StaggerItem key={title}>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 h-full">
                  <div className="text-2xl mb-4">{icon}</div>
                  <h3 className="text-base font-black text-stone-900">{title}</h3>
                  <p className="text-stone-500 text-sm mt-2 leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── About / Story teaser ─────────────────────────── */}
      <section className="py-10 md:py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 leading-snug">
              Grown with Love,<br />Delivered with Pride
            </h2>
            <p className="font-bold text-stone-900 mt-4 text-base">Three generations of mango farming excellence</p>
            <p className="text-stone-500 mt-3 text-sm leading-relaxed">
              Our farm is nestled near Kalaghatgi Road, Dharwad. For decades, our family has
              nurtured mango trees using traditional methods — no harmful chemicals, natural
              ripening, and picking at the moment of perfection.
            </p>
            <p className="text-stone-500 mt-3 text-sm leading-relaxed">
              Located near Nuggikeri Hanuman Temple, Dharwad, we are proud to bring
              the taste of Karnataka to homes across India.
            </p>
            <Link
              href="/about"
              className="inline-block mt-7 border-2 border-stone-900 text-stone-900 font-bold px-7 py-2.5 rounded-lg hover:bg-stone-900 hover:text-white transition-all text-sm uppercase tracking-wider"
            >
              Our Story →
            </Link>
          </FadeInUp>

          <FadeInUp delay={0.1} className="hidden md:block">
            <div className="relative h-80 rounded-2xl overflow-hidden bg-amber-100">
              <Image
                src="/gallery/photo6.jpeg"
                alt="Our mango farm in Dharwad"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 0vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── Order CTA ────────────────────────────────────── */}
      <section className="bg-amber-600 py-16 px-4 text-center">
        <FadeInUp>
          <p className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-3">Limited Season</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Order Fresh Mangoes Today</h2>
          <p className="font-bold text-white mt-3 text-base">April – June season · Direct from Dharwad</p>
          <p className="text-amber-100 mt-2 text-sm">
            Near Nuggikeri Hanuman Temple, Kalaghatgi Road, Dharwad
          </p>
          <div className="mt-7 flex gap-4 justify-center flex-wrap">
            <Link
              href="/varieties"
              className="bg-white text-amber-700 font-black px-9 py-3 rounded-lg hover:bg-amber-50 transition-colors text-sm uppercase tracking-wider"
            >
              Place Your Order
            </Link>
          </div>
          <p className="text-amber-100 mt-4 text-sm font-semibold">
            Subhas Akalwadi 9448822711 &nbsp;|&nbsp; Naman Akalwadi 8431309384
          </p>
        </FadeInUp>
      </section>

    </main>
  );
}
