import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPageClient } from "@/components/blog-page-client";
import { getBlogPageBySlug } from "@/lib/site-sections";
import { siteConfig } from "@/lib/site-config";

type ServiceBlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ServiceBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getBlogPageBySlug("services", slug);
  if (!page) {
    return {
      title: `Services — ${siteConfig.name}`,
    };
  }

  return {
    title: `${page.title} — ${siteConfig.name}`,
    description: page.intro,
  };
}

export default async function ServiceBlogPage({
  params,
}: ServiceBlogPageProps) {
  const { slug } = await params;
  const page = getBlogPageBySlug("services", slug);
  if (!page) {
    notFound();
  }

  return <BlogPageClient page={page} />;
}
