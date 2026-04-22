import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mangoes from "@/data/mangoes.json";
import OrderForm from "./OrderForm";

const mangoImages: Record<number, string> = {
  1: "/khadar.jpeg",
  2: "/kesar.jpeg",
  3: "/alphonso.jpeg",
  5: "/kalmi.jpeg",
};

export function generateStaticParams() {
  return mangoes.map((m) => ({ id: String(m.id) }));
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mango = mangoes.find((m) => m.id === Number(id));

  if (!mango) notFound();
  if (!mango.inStock) redirect("/varieties");

  const imageUrl = mangoImages[mango.id] ?? mangoImages[1];

  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Link href="/varieties" className="hover:text-amber-400">Varieties</Link>
            {" "}&rsaquo; Order
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white">{mango.name}</h1>
          <p className="font-bold text-stone-300 mt-1">{mango.origin}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Left: static — prerendered */}
          <div>
            <div className="relative h-72 rounded-2xl overflow-hidden bg-amber-100">
              <Image
                src={imageUrl}
                alt={mango.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-black text-stone-900">{mango.name} Mangoes</h2>
              <p className="text-stone-500 mt-2 leading-relaxed">{mango.description}</p>
              <div className="mt-4 flex gap-4 flex-wrap text-sm">
                <span className="bg-stone-100 text-stone-600 font-bold px-3 py-1 rounded-full">
                  {mango.origin}
                </span>
              </div>
            </div>
          </div>

          {/* Right: interactive form — client component */}
          <OrderForm mango={{ id: mango.id, name: mango.name, price: mango.price, hasVariants: mango.hasVariants }} />

        </div>
      </section>
    </main>
  );
}
