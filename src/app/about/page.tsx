import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { AboutClient } from "@/app/about/about-client";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description: `Background, focus areas, and approach for ${siteConfig.name}.`,
};

export default function AboutPage() {
  return <AboutClient />;
}
