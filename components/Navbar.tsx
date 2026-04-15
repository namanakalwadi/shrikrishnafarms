"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/lib/cartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/varieties", label: "Varieties" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "border-b border-stone-100"}`}>
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoMark size={44} />
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Akalwadi's</p>
            <p className="text-sm font-black text-stone-900 uppercase tracking-wide leading-tight">Shri Krishna Farms</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"}`}>
                  {label}
                </Link>
              </li>
            );
          })}

          {/* My Orders */}
          <li>
            <Link href="/my-orders"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${pathname === "/my-orders" ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"}`}>
              My Orders
            </Link>
          </li>

          {/* Cart */}
          <li className="ml-2">
            <Link href="/cart" className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-700 transition-all text-sm font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Mobile: cart icon + toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-stone-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-amber-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-stone-50"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block h-0.5 w-5 rounded-full bg-stone-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-stone-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-stone-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-5 pt-2 border-t border-stone-100 bg-white">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link href={href}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}`}>
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/my-orders"
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === "/my-orders" ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}`}>
                My Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
