"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 5, suffix: "+", label: "Acres of Orchard" },
  { value: 2, suffix: "", label: "Mango Varieties" },
  { value: 3, suffix: "rd", label: "Generation Farm" },
  { value: 1000, suffix: "+", label: "Happy Customers" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const steps = 55;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function AnimatedStats() {
  return (
    <section className="bg-stone-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">By the Numbers</p>
          <h2 className="text-3xl font-black text-white">Farm at a Glance</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-stone-700 rounded-2xl py-6 px-4 text-center"
            >
              <div className="text-3xl font-black text-amber-400">
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-stone-400 text-xs mt-1.5 uppercase tracking-wide font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
