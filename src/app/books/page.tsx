import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { BooksClient } from "@/app/books/books-client";

export const metadata: Metadata = {
  title: `Books — ${siteConfig.name}`,
  description: `Recommended books and reading notes from ${siteConfig.name}.`,
};

export default function BooksPage() {
  return <BooksClient />;
}

