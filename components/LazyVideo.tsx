"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  className?: string;
}

export default function LazyVideo({ src, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      autoPlay={active}
      muted
      loop
      playsInline
      className={className}
    />
  );
}
