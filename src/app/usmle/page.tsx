import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { UsmleClient } from "@/app/usmle/usmle-client";

export const metadata: Metadata = {
  title: `USMLE — ${siteConfig.name}`,
  description: `USMLE exam preparations and study resources from ${siteConfig.name}.`,
};

export default function UsmlePage() {
  return <UsmleClient />;
}
