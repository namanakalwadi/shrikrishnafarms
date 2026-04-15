import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import WhatsAppButton from "@/components/WhatsAppButton";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shrikrishnafarms.in"),
  title: "Akalwadi's Shri Krishna Farms — Premium Farm Fresh Mangoes",
  description:
    "Farm-fresh mangoes from Dharwad, Karnataka. Khadar, Kesar, Alphonso, Kalmi and more. Delivered across Karnataka. Call: Subhas Akalwadi 9448822711 / Naman Akalwadi 8431309384.",
  openGraph: {
    title: "Akalwadi's Shri Krishna Farms",
    description: "Experience summer in every bite. Farm-fresh mangoes from Dharwad, Karnataka.",
    siteName: "Shri Krishna Farms",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo/logo.png",
        width: 800,
        height: 600,
        alt: "Shri Krishna Farms Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <ErrorBoundary>
            <div className="flex-1">{children}</div>
          </ErrorBoundary>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
