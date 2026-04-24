"use client";

import * as React from "react";
import type { BlogPostItem } from "@/lib/content-types";

export function BlogPostModal({
  item,
  onClose,
}: {
  item: BlogPostItem;
  onClose: () => void;
}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
      <div
        className="absolute inset-0 bg-black/60-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 no-scrollbar dark:bg-[#0d1b30] dark:ring-white/10">
        <div className="p-8 sm:p-10">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-zinc-100 p-2 text-[#7a90ab] transition hover:bg-zinc-200 hover:text-[#0c2d6b] dark:bg-[#0f2040] dark:text-slate-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="break-words text-3xl font-bold leading-tight text-[#0c2d6b] dark:text-white">
                {item.title}
              </h2>
            </div>

            {item.imageFileId ? (
              <img
                src={`/api/blog-posts/image?id=${item.imageFileId}`}
                alt={item.title}
                className="w-full rounded-2xl bg-zinc-100 object-cover shadow-sm dark:bg-[#0f2040]"
              />
            ) : null}

            <div className="prose prose-zinc max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-[#374c66] dark:text-slate-300">
                {item.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
