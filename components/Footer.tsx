import LogoMark from "@/components/LogoMark";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <LogoMark size={40} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Akalwadi's</p>
              <p className="text-sm font-black text-white uppercase tracking-wide leading-tight">Shri Krishna Farms</p>
            </div>
          </div>

          {/* Address */}
          <div className="text-sm text-stone-400">
            <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-1">Address</p>
            <p className="text-stone-300 leading-snug">
              Near Nuggikeri Hanuman Temple, Kalaghatgi Road, Dharwad
            </p>
          </div>

          {/* Contacts */}
          <div className="text-sm shrink-0">
            <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-1">Fruit Delivery</p>
            <a href="tel:9448822711" className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors">
              <span className="text-amber-500">—</span> Subhas Akalwadi · 9448822711
            </a>
            <a href="tel:8431309384" className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors mt-0.5">
              <span className="text-amber-500">—</span> Naman Akalwadi · 8431309384
            </a>
            <a href="tel:9448133699" className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors mt-0.5">
              <span className="text-amber-500">—</span> Deepak Akalwadi · 9448133699
            </a>
          </div>

        </div>

        <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-stone-600 text-xs">© {new Date().getFullYear()} Akalwadi's Shri Krishna Farms. All rights reserved.</p>
          <p className="text-stone-600 text-xs">Dharwad, Karnataka, India</p>
        </div>
      </div>
    </footer>
  );
}
