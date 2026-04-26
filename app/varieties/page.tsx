import MangoCard from "@/components/MangoCard";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import mangoes from "@/data/mangoes.json";
import { getInventoryMap } from "@/lib/inventory";

export const revalidate = 30;

export default async function VarietiesPage() {
  const inventory = await getInventoryMap();

  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">What We Grow</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Our Mango Varieties</h1>
          <p className="font-bold text-stone-300 mt-3 text-lg max-w-xl">
            Four premium varieties, each with a distinct character and flavour
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mangoes.map((mango) => (
            <StaggerItem key={mango.id}>
              <MangoCard {...mango} inStock={inventory[mango.id] ?? mango.inStock} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

    </main>
  );
}
