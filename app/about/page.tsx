import Image from "next/image";
import FadeInUp from "@/components/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import AnimatedStats from "@/components/AnimatedStats";

const values = [
  { icon: "🌿", title: "Natural Farming", desc: "No chemicals, Organic pesticides and insecticides, Animal based Manure, traditional methods, sustainable practices passed down through generations." },
  { icon: "❤️", title: "Family Legacy", desc: "Three generations of mango farming knowledge and pride go into every fruit we grow." },
  { icon: "🤝", title: "Fair Pricing", desc: "Farm-to-home direct sales mean no middlemen and better prices for you." },
  { icon: "✓", title: "Peak Freshness", desc: "Mangoes are picked and dispatched at peak ripeness — never artificially ripened." },
];

export default function AboutPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Our Story</h1>
          <p className="font-bold text-stone-300 mt-3 text-lg max-w-xl">
            Three generations of mango farming from the heart of Dharwad
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">Our History</p>
            <h2 className="text-3xl font-black text-stone-900 leading-snug">
              Akalwadi's Shri Krishna Farms
            </h2>
            <p className="font-bold text-stone-900 mt-3 text-base">Dharwad, Karnataka</p>
            <p className="text-stone-500 mt-4 leading-relaxed text-sm">
              Situated near Nuggikeri Hanuman Temple, Kalaghatgi Road, Dharwad, our farm has
              been a labour of love for over three generations. From a small orchard, we have
              grown into a 5+ acre farm producing some of Karnataka's finest mangoes.
            </p>
            <p className="text-stone-500 mt-3 leading-relaxed text-sm">
              We believe in growing mangoes the right way — no harmful chemicals, allowing
              natural ripening, and picking every fruit at the moment of perfection. Each crate
              that leaves our farm carries our family's name and our promise of quality.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.1} className="hidden md:block">
            <div className="relative h-72 rounded-2xl overflow-hidden bg-amber-100">
              <Image
                src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80&fit=crop"
                alt="Shri Krishna Farm mangoes"
                fill
                className="object-cover"
              />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInUp className="mb-12">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-3xl font-black text-stone-900">Our Values</h2>
          </FadeInUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map(({ icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 flex gap-4 items-start">
                  <span className="text-3xl shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-black text-stone-900 text-base">{title}</h3>
                    <p className="text-stone-500 text-sm mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Stats */}
      <AnimatedStats />

      {/* Location */}
      <section className="bg-amber-600 py-14 px-4 text-center">
        <FadeInUp>
          <p className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-3">Find Us</p>
          <h2 className="text-2xl md:text-3xl font-black text-white">Visit Our Farm</h2>
          <p className="font-bold text-white mt-3 text-base">
            Near Nuggikeri Hanuman Temple, Kalaghatgi Road, Dharwad
          </p>
          <div className="mt-5 flex gap-5 justify-center flex-wrap text-sm">
            <a href="tel:9448822711" className="text-amber-100 hover:text-white transition-colors font-semibold">
              Subhas Akalwadi · 9448822711
            </a>
            <a href="tel:8431309384" className="text-amber-100 hover:text-white transition-colors font-semibold">
              Naman Akalwadi · 8431309384
            </a>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
}
