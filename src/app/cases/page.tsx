import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { CasesClient } from "@/app/cases/cases-client";

export const metadata: Metadata = {
  title: `Cases — ${siteConfig.name}`,
  description: `Case summaries and clinical walkthroughs by ${siteConfig.name}.`,
};

export default function CasesPage() {
  return <CasesClient />;
}

