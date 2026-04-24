import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { VideosClient } from "@/app/videos/videos-client";

export const metadata: Metadata = {
  title: `Medications — ${siteConfig.name}`,
  description:
    "Upload medication-related videos, reference images, and YouTube links in one filterable media library.",
};

export default function VideosPage() {
  return <VideosClient />;
}

