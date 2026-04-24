import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPageClient } from "@/components/blog-page-client";
import { getBlogPageBySlug } from "@/lib/site-sections";
import { siteConfig } from "@/lib/site-config";

type ProductBlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getBlogPageBySlug("products", slug);
  if (!page) {
    return {
      title: `Products — ${siteConfig.name}`,
    };
  }

  return {
    title: `${page.title} — ${siteConfig.name}`,
    description: page.intro,
  };
}

export default async function ProductBlogPage({
  params,
}: ProductBlogPageProps) {
  const { slug } = await params;
  const page = getBlogPageBySlug("products", slug);
  if (!page || page.slug === "medical-news") {
    notFound();
  }

  return <BlogPageClient page={page} />;
}
