import type { Metadata } from "next";
import { DoctorsClient } from "@/app/doctors/doctors-client";
import { DOCTOR_NICHES } from "@/lib/site-sections";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Doctors — ${siteConfig.name}`,
  description: `Doctor profiles, photos, and biographies from ${siteConfig.name}.`,
};

type DoctorsPageProps = {
  searchParams: Promise<{ niche?: string | string[] }>;
};

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawNiche = Array.isArray(resolvedSearchParams.niche)
    ? resolvedSearchParams.niche[0]
    : resolvedSearchParams.niche;
  const initialNiche =
    rawNiche && DOCTOR_NICHES.includes(rawNiche as (typeof DOCTOR_NICHES)[number]) ? rawNiche : null;

  return <DoctorsClient initialNiche={initialNiche} />;
}
