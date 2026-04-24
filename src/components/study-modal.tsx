"use client";

import * as React from "react";
import type { StudyItem } from "@/lib/content-types";

export function StudyModal({ item, onClose }: { item: StudyItem; onClose: () => void }) {
    // Lock body scroll
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
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-[#0d1b30] ring-1 ring-black/5 dark:ring-white/10 no-scrollbar">
                <div className="p-8 sm:p-10">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full bg-zinc-100 text-[#7a90ab] hover:bg-zinc-200 hover:text-[#0c2d6b] dark:bg-[#0f2040] dark:text-slate-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-[#0c2d6b] dark:text-white leading-tight break-words">{item.title}</h2>
                        </div>

                        {item.imageFileId && (
                            <img
                                src={`/api/medical-news/image?id=${item.imageFileId}`}
                                alt={item.title}
                                className="w-full rounded-2xl object-cover bg-zinc-100 dark:bg-[#0f2040] shadow-sm"
                            />
                        )}

                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap break-words leading-relaxed text-[#374c66] dark:text-slate-300 text-base">
                                {item.notes}
                            </p>
                        </div>

                        {(item.url || item.tags.length > 0) && (
                            <div className="pt-6 border-t border-[#dbe8f5] dark:border-[#dbe8f5] flex flex-col gap-4">
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1666d1] hover:text-blue-500 dark:text-sky-400"
                                    >
                                        <span>Read source</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}

                                {item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#0f2040] text-xs font-medium text-[#4a6180] dark:text-slate-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
