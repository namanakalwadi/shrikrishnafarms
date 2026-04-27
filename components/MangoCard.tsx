"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface MangoCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  origin: string;
  season: string;
  inStock: boolean;
}

const mangoImages: Record<number, string> = {
  2: "/kesar.jpeg",
  3: "/alphonso.jpeg",
};

const fallbackGradients: Record<number, string> = {
  2: "from-orange-200 to-amber-200",
  3: "from-yellow-200 to-orange-200",
};

export default function MangoCard({ id, name, description, price, priceUnit, origin, inStock }: MangoCardProps) {
  const imageUrl = mangoImages[id] ?? mangoImages[3];
  const fallback = fallbackGradients[id] ?? fallbackGradients[3];

  const card = (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-stone-100 h-full cursor-pointer"
    >
      {/* Image */}
      <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${fallback}`}>
        <Image
          src={imageUrl}
          alt={`${name} mango`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-xl font-black text-stone-900">{name}</h3>
        <p className="text-xs text-stone-400 mt-1 font-medium">{origin}</p>
        <p className="text-stone-500 mt-3 text-sm leading-relaxed line-clamp-2">{description}</p>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-amber-600">₹{price}</span>
            <span className="text-xs text-stone-400 ml-1">{priceUnit}</span>
          </div>
          {inStock ? (
            <span className="bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-lg">
              Order Now
            </span>
          ) : (
            <span className="text-stone-400 text-sm font-bold px-5 py-2 rounded-lg border border-stone-200">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (!inStock) return card;

  return (
    <Link href={`/order/${id}`} className="block h-full">
      {card}
    </Link>
  );
}
