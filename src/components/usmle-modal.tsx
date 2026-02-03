"use client";

import * as React from "react";
import type { UsmleItem } from "@/lib/content-types";

function formatDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function UsmleModal({ item, onClose }: { item: UsmleItem; onClose: () => void }) {
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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 no-scrollbar">
                <div className="p-8 sm:p-10">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight break-words">{item.title}</h2>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{formatDate(item.createdAt)}</p>
                        </div>

                        {item.fileId && item.fileType === "image" && (
                            <img
                                src={`/api/usmle/image?id=${item.fileId}`}
                                alt={item.title}
                                className="w-full rounded-2xl object-cover bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                            />
                        )}

                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap break-words leading-relaxed text-zinc-700 dark:text-zinc-300 text-base">
                                {item.description}
                            </p>
                        </div>

                        {(item.url || (item.fileId && item.fileType !== "image")) && (
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                                {item.fileId && item.fileType !== "image" && (
                                    <a
                                        href={`/api/usmle/download?id=${item.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                                    >
                                        <span>Download PDF</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                )}

                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                                    >
                                        <span>Open Link</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
