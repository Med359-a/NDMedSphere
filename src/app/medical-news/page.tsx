import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { MedicalNewsClient } from "@/app/medical-news/medical-news-client";

export const metadata: Metadata = {
  title: `Medical News — ${siteConfig.name}`,
  description: `Latest medical news and updates from ${siteConfig.name}.`,
};

export default function MedicalNewsPage() {
  return <MedicalNewsClient />;
}
