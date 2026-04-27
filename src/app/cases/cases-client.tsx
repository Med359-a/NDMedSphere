"use client";

import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/container";
import type { TopicItem, QuizItem } from "@/lib/content-types";
import { useAdmin } from "@/lib/use-admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function QuizView({
  topic,
  isAdmin,
  onBack,
  onQuizAdded,
  onQuizDeleted,
}: {
  topic: TopicItem;
  isAdmin: boolean;
  onBack: () => void;
  onQuizAdded: (quiz: QuizItem) => void;
  onQuizDeleted: (quizId: string) => void;
}) {
  const [question, setQuestion] = React.useState("");
  const [answers, setAnswers] = React.useState<{ text: string; isCorrect: boolean }[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [explanation, setExplanation] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [userAnswers, setUserAnswers] = React.useState<Record<string, string>>({});
  const [showResults, setShowResults] = React.useState<Record<string, boolean>>({});

  async function onAddQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const validAnswers = answers.filter((a) => a.text.trim()).map((a) => ({ ...a, id: crypto.randomUUID() }));
    if (validAnswers.length < 2) { alert("Please provide at least 2 answers."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("topicId", topic.id); fd.append("question", question.trim());
      fd.append("explanation", explanation.trim()); fd.append("answers", JSON.stringify(validAnswers));
      if (file) fd.append("file", file);
      const res = await fetch("/api/cases/quiz", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to add quiz");
      const payload = await res.json();
      onQuizAdded(payload.quiz);
      setQuestion(""); setAnswers([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
      setExplanation(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) { alert("Failed to add quiz."); console.error(e); }
    finally { setSaving(false); }
  }

  async function onDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/cases/quiz?topicId=${encodeURIComponent(topic.id)}&quizId=${encodeURIComponent(quizId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete quiz");
      onQuizDeleted(quizId);
    } catch (e) { alert("Delete failed."); console.error(e); }
  }

  return (
    <div>
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-12">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7a90ab] transition-colors hover:text-[#0c2d6b] dark:text-slate-400 dark:hover:text-zinc-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Topics
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="mt-2 text-[#4a6180] dark:text-slate-300">{topic.description}</p>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
            <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {topic.quizzes.length} question{topic.quizzes.length !== 1 ? "s" : ""}
          </div>
        </Container>
      </section>

      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-12">
          <div className="space-y-6">
            {topic.quizzes.map((quiz, i) => {
              const isAnswered = !!userAnswers[quiz.id];
              const isResultShown = !!showResults[quiz.id];
              const selectedAnswerId = userAnswers[quiz.id];

              return (
                <div
                  key={quiz.id}
                  className="animate-fade-up rounded-2xl border border-[#dbe8f5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-[#0c2d6b] dark:text-white">{quiz.question}</h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteQuiz(quiz.id)}
                        className="shrink-0 text-xs font-medium text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {quiz.imageFileId && (
                    <div className="mt-4">
                      <img
                        src={`/api/cases/quiz/image?id=${quiz.imageFileId}`}
                        alt="Question"
                        className="max-h-80 rounded-xl object-contain"
                      />
                    </div>
                  )}

                  <div className="mt-5 grid gap-2.5">
                    {quiz.answers.map((ans) => {
                      let cls = "border-[#dbe8f5] bg-[#f4f8fd] hover:bg-[#eff6ff] dark:border-white/10 dark:bg-[#0d1b30] dark:hover:bg-zinc-800";
                      if (isResultShown) {
                        if (ans.isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200";
                        else if (selectedAnswerId === ans.id) cls = "border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200";
                        else cls = "opacity-40";
                      } else if (selectedAnswerId === ans.id) {
                        cls = "border-sky-500 bg-sky-50 text-sky-900 ring-1 ring-sky-500 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-sky-200";
                      }
                      return (
                        <button
                          key={ans.id}
                          disabled={isResultShown}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [quiz.id]: ans.id }))}
                          className={`flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
                        >
                          {ans.text}
                        </button>
                      );
                    })}
                  </div>

                  {!isResultShown && selectedAnswerId && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowResults((prev) => ({ ...prev, [quiz.id]: true }))}
                        className="rounded-lg bg-[#1666d1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1255b8]"
                      >
                        Check Answer
                      </button>
                    </div>
                  )}

                  {isResultShown && quiz.explanation && (
                    <div className="mt-4 rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-4 text-sm text-[#374c66] dark:border-white/[0.06] dark:bg-[#0d1b30] dark:text-slate-300">
                      <span className="font-semibold text-[#0c2d6b] dark:text-white">Explanation: </span>
                      {quiz.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {topic.quizzes.length === 0 && (
              <div className="py-12 text-center text-[#7a90ab] dark:text-slate-400">
                No questions yet.
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="mt-12 rounded-2xl border border-[#dbe8f5] bg-white shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="border-b border-[#dbe8f5] px-7 py-5 dark:border-white/[0.06]">
                <div className="text-base font-bold text-[#0c2d6b] dark:text-white">Add Question</div>
                <p className="mt-1 text-sm text-[#7a90ab] dark:text-slate-400">
                  Write the question, attach an image, add answer choices, mark the correct one, and optionally add an explanation.
                </p>
              </div>
              <form onSubmit={onAddQuiz} className="grid gap-6 p-7">
                {/* Question */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a90ab] dark:text-slate-400">
                    Question <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-24 w-full rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-[#0d1b30]"
                    placeholder="Enter question text…"
                    required
                  />
                </div>

                {/* Image upload */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a90ab] dark:text-slate-400">
                    Image <span className="font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] px-4 py-2.5 text-sm font-semibold text-[#374c66] shadow-sm transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/15 dark:bg-[#0d1b30] dark:text-slate-200 dark:hover:border-emerald-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {file ? "Change image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="sr-only"
                      />
                    </label>
                    {file && (
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {file.name}
                        <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="ml-1 text-emerald-500 hover:text-rose-500">✕</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answers */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a90ab] dark:text-slate-400">
                      Answer choices <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-[#7a90ab] dark:text-slate-500">Click the circle to mark correct</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] dark:border-white/10 dark:bg-[#0d1b30]">
                    {answers.map((ans, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 border-b border-[#dbe8f5] px-4 py-3 last:border-b-0 dark:border-white/[0.06] ${ans.isCorrect ? "bg-emerald-50 dark:bg-emerald-500/10" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const next = answers.map((a, idx) => ({ ...a, isCorrect: idx === i }));
                            setAnswers(next);
                          }}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            ans.isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-[#dbe8f5] bg-white hover:border-emerald-400 dark:border-white/20 dark:bg-[#0f2040]"
                          }`}
                          aria-label={`Mark option ${i + 1} as correct`}
                        >
                          {ans.isCorrect && (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className="shrink-0 text-xs font-bold text-[#7a90ab] dark:text-slate-500">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <input
                          value={ans.text}
                          onChange={(e) => {
                            const next = [...answers];
                            next[i] = { ...next[i], text: e.target.value };
                            setAnswers(next);
                          }}
                          className="flex-1 bg-transparent text-sm text-[#374c66] outline-none placeholder:text-[#b0bfcf] dark:text-slate-200"
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        />
                        <button
                          type="button"
                          onClick={() => { if (answers.length > 2) setAnswers(answers.filter((_, idx) => idx !== i)); }}
                          disabled={answers.length <= 2}
                          className="shrink-0 rounded-lg p-1 text-[#b0bfcf] transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-20 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers([...answers, { text: "", isCorrect: false }])}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add option
                  </button>
                </div>

                {/* Explanation */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a90ab] dark:text-slate-400">
                    Explanation <span className="font-normal normal-case tracking-normal">(shown after answering)</span>
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="min-h-20 w-full rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-[#0d1b30]"
                    placeholder="Why is the correct answer correct? This appears after the user submits."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Adding…
                    </>
                  ) : "Add Question"}
                </button>
              </form>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export function CasesClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [topics, setTopics] = React.useState<TopicItem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/cases", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load topics");
      const data = (await res.json()) as TopicItem[];
      setTopics(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Failed to load topics." });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Create failed");
      const payload = await res.json();
      setTopics([payload.item, ...topics]);
      setTitle(""); setDescription("");
    } catch { alert("Failed to create topic."); }
    finally { setCreating(false); }
  }

  async function onDeleteTopic(id: string) {
    if (!confirm("Delete this topic and all its questions?")) return;
    try {
      const res = await fetch(`/api/cases?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTopics(topics.filter((t) => t.id !== id));
      if (selectedTopicId === id) setSelectedTopicId(null);
    } catch { alert("Failed to delete topic."); }
  }

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  if (selectedTopic) {
    return (
      <QuizView
        topic={selectedTopic}
        isAdmin={isAdmin}
        onBack={() => setSelectedTopicId(null)}
        onQuizAdded={(q) => setTopics(topics.map((t) => t.id === selectedTopic.id ? { ...t, quizzes: [...t.quizzes, q] } : t))}
        onQuizDeleted={(qid) => setTopics(topics.map((t) => t.id === selectedTopic.id ? { ...t, quizzes: t.quizzes.filter((x) => x.id !== qid) } : t))}
      />
    );
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl space-y-5 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/8 dark:text-violet-300">
              Cases
            </div>
            <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
              Clinical Cases
            </h1>
            <p className="text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
              Clinical case walkthroughs and interactive quizzes for sharpening diagnostic reasoning.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Topics ───────────────────────────────────── */}
      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-16">
          {load.status === "loading" && topics.length === 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl border border-[#dbe8f5] bg-white dark:border-white/10 dark:bg-[#0f2040]" />
              ))}
            </div>
          )}

          {load.status !== "loading" && topics.length === 0 && !isAdmin && (
            <div className="rounded-2xl border border-[#dbe8f5] bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6ff] dark:bg-sky-400/10">
                <svg className="h-7 w-7 text-[#7a90ab]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">No topics yet</div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">Check back soon.</p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <div
                key={t.id}
                className="animate-fade-up group flex flex-col justify-between rounded-2xl border border-[#dbe8f5] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#0f2040]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-400/10 mb-4">
                    <svg className="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-[#0c2d6b] dark:text-white">{t.title}</h3>
                  {t.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#4a6180] dark:text-slate-300">{t.description}</p>
                  )}
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-medium text-[#1666d1] dark:bg-sky-400/10 dark:text-sky-300">
                    {t.quizzes.length} question{t.quizzes.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#dbe8f5] dark:border-white/[0.06]">
                  <button
                    onClick={() => setSelectedTopicId(t.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Open topic
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTopic(t.id); }}
                      className="text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isAdmin && (
              <div className="rounded-[2rem] border border-dashed border-[#dbe8f5] bg-[#f4f8fd] p-7 dark:border-white/12 dark:bg-white/[0.03]">
                <form onSubmit={onCreateTopic} className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4 text-sm font-semibold text-[#0c2d6b] dark:text-white">New Topic</div>
                    <div className="space-y-3">
                      <input
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="Topic title"
                        className="h-10 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-[#0f2040]"
                        required
                      />
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="min-h-20 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-[#0f2040]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={creating || !title}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1666d1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1255b8] disabled:opacity-50"
                  >
                    {creating ? "Creating…" : "Create Topic"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
