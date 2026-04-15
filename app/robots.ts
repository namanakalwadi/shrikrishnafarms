import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://shrikrishnafarms.in"; // update when you have a real domain

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/varieties", "/about", "/gallery", "/contact"],
        disallow: ["/checkout", "/cart", "/my-orders", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
