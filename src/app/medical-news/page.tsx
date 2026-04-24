import type { Metadata } from "next";
import { BlogPageClient } from "@/components/blog-page-client";
import { PRODUCT_PAGES } from "@/lib/site-sections";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Medical News — ${siteConfig.name}`,
  description: `Latest medical news and updates from ${siteConfig.name}.`,
};

export default function MedicalNewsPage() {
  const page = PRODUCT_PAGES.find((item) => item.slug === "medical-news");
  if (!page) return null;
  return <BlogPageClient page={page} />;
}
