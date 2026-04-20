import type { Metadata } from "next";
import { DoctorsClient } from "@/app/doctors/doctors-client";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Doctors — ${siteConfig.name}`,
  description: `Doctor profiles, photos, and biographies from ${siteConfig.name}.`,
};

export default function DoctorsPage() {
  return <DoctorsClient />;
}
