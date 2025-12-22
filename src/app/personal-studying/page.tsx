import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { PersonalStudyingClient } from "@/app/personal-studying/personal-studying-client";

export const metadata: Metadata = {
  title: `Personal Studying — ${siteConfig.name}`,
  description: `Study workflow and learning notes from ${siteConfig.name}.`,
};

export default function PersonalStudyingPage() {
  return <PersonalStudyingClient />;
}

