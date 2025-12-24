import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { ContactClient } from "@/app/contact/contact-client";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return <ContactClient />;
}
