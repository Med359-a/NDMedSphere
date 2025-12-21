import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { VideosClient } from "@/app/videos/videos-client";

export const metadata: Metadata = {
  title: `Videos — ${siteConfig.clinicName}`,
  description:
    "Upload videos of your work (procedures, education, case walkthroughs) and display them in a gallery.",
};

export default function VideosPage() {
  return <VideosClient />;
}


