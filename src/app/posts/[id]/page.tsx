import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toBlogPostItem, type MedicalNewsRow } from "@/lib/supabase-content";
import { getBlogPageBySlug } from "@/lib/site-sections";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function fetchPost(id: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("medical_news")
    .select("id, title, notes, tags, url, image_path, page_slug, page_group, created_at")
    .eq("id", id)
    .limit(1);
  if (error || !data?.length) return null;
  return toBlogPostItem(data[0] as MedicalNewsRow);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) return { title: siteConfig.name };
  return {
    title: `${post.title} — ${siteConfig.name}`,
    description: post.body.slice(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) notFound();

  const parentPage = getBlogPageBySlug(post.pageGroup, post.pageSlug);
  const backHref = post.pageGroup === "products"
    ? `/products/${post.pageSlug}`
    : `/services/${post.pageSlug}`;

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* ── Back bar ─────────────────────────────────── */}
      <div className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7a90ab] transition hover:text-[#0c2d6b] dark:text-slate-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {parentPage?.title ?? "Back"}
          </Link>
        </Container>
      </div>

      {/* ── Hero image ───────────────────────────────── */}
      {post.imageFileId ? (
        <div className="relative h-56 w-full overflow-hidden bg-[#f4f8fd] sm:h-72 lg:h-96 dark:bg-[#0d1b30]">
          <Image
            src={`/api/blog-posts/image?id=${post.imageFileId}`}
            alt={post.title}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent dark:from-[#070f1f]/60" />
        </div>
      ) : null}

      {/* ── Content ──────────────────────────────────── */}
      <section className="bg-white dark:bg-[#070f1f]">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            {/* Eyebrow + date */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {parentPage && (
                <span className="rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                  {parentPage.eyebrow}
                </span>
              )}
              <span className="text-xs text-[#7a90ab] dark:text-slate-400">{date}</span>
            </div>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-10 border-t border-[#dbe8f5] pt-8 dark:border-white/[0.06]">
              {post.body.split(/\n+/).filter(Boolean).map((para, i) => (
                <p key={i} className="mb-5 text-base leading-8 text-[#4a6180] dark:text-slate-300 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="mt-12 flex gap-3 border-t border-[#dbe8f5] pt-8 dark:border-white/[0.06]">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-5 py-2.5 text-sm font-semibold text-[#374c66] shadow-sm transition hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {parentPage?.title ?? "Back"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
