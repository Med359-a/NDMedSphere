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

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

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

  // User state for taking the quiz
  const [userAnswers, setUserAnswers] = React.useState<Record<string, string>>({}); // quizId -> answerId
  const [showResults, setShowResults] = React.useState<Record<string, boolean>>({}); // quizId -> boolean

  async function onAddQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    // Filter empty answers
    const validAnswers = answers
      .filter((a) => a.text.trim())
      .map((a) => ({ ...a, id: crypto.randomUUID() }));

    if (validAnswers.length < 2) {
      alert("Please provide at least 2 answers.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("topicId", topic.id);
      fd.append("question", question.trim());
      fd.append("explanation", explanation.trim());
      fd.append("answers", JSON.stringify(validAnswers));
      if (file) {
        fd.append("file", file);
      }

      const res = await fetch("/api/cases/quiz", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Failed to add quiz");
      }

      const payload = await res.json();
      onQuizAdded(payload.quiz);

      // Reset form
      setQuestion("");
      setAnswers([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setExplanation("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      alert("Failed to add quiz. See console for details.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(
        `/api/cases/quiz?topicId=${encodeURIComponent(topic.id)}&quizId=${encodeURIComponent(
          quizId,
        )}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete quiz");
      onQuizDeleted(quizId);
    } catch (e) {
      alert("Delete failed.");
      console.error(e);
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to Topics
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
        {topic.description ? (
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">{topic.description}</p>
        ) : null}
      </div>

      <div className="space-y-12">
        {topic.quizzes.map((quiz, i) => {
          const isAnswered = !!userAnswers[quiz.id];
          const isResultShown = !!showResults[quiz.id];
          const selectedAnswerId = userAnswers[quiz.id];

          return (
            <div
              key={quiz.id}
              className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
            >
              <div className="flex justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  Q{i + 1}. {quiz.question}
                </h3>
                {isAdmin ? (
                  <button
                    onClick={() => onDeleteQuiz(quiz.id)}
                    className="shrink-0 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                  >
                    Delete
                  </button>
                ) : null}
              </div>

              {quiz.imageFileId ? (
                <div className="mt-4">
                  <img
                    src={`/api/cases/quiz/image?id=${quiz.imageFileId}`}
                    alt="Question"
                    className="max-h-96 rounded-lg object-contain"
                  />
                </div>
              ) : null}

              <div className="mt-6 grid gap-3">
                {quiz.answers.map((ans) => {
                  let style =
                    "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800";

                  if (isResultShown) {
                    if (ans.isCorrect) {
                      style =
                        "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200";
                    } else if (selectedAnswerId === ans.id && !ans.isCorrect) {
                      style =
                        "border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200";
                    } else {
                      style = "opacity-50";
                    }
                  } else if (selectedAnswerId === ans.id) {
                    style =
                      "border-sky-500 bg-sky-50 text-sky-900 ring-1 ring-sky-500 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-sky-200";
                  }

                  return (
                    <button
                      key={ans.id}
                      disabled={isResultShown}
                      onClick={() =>
                        setUserAnswers((prev) => ({ ...prev, [quiz.id]: ans.id }))
                      }
                      className={`flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
                    >
                      {ans.text}
                    </button>
                  );
                })}
              </div>

              {!isResultShown && selectedAnswerId ? (
                <div className="mt-4">
                  <button
                    onClick={() => setShowResults((prev) => ({ ...prev, [quiz.id]: true }))}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    Check Answer
                  </button>
                </div>
              ) : null}

              {isResultShown && quiz.explanation ? (
                <div className="mt-4 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  <span className="font-semibold">Explanation:</span> {quiz.explanation}
                </div>
              ) : null}
            </div>
          );
        })}

        {topic.quizzes.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">
            No questions yet.
          </div>
        ) : null}
      </div>

      {isAdmin ? (
        <div className="mt-12 rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
          <div className="text-lg font-semibold">Add Question</div>
          <form onSubmit={onAddQuiz} className="mt-6 grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-24 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                placeholder="Enter question text..."
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Answers</label>
              {answers.map((ans, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={ans.isCorrect}
                    onChange={() => {
                      const next = [...answers];
                      next.forEach((a) => (a.isCorrect = false));
                      next[i].isCorrect = true;
                      setAnswers(next);
                    }}
                    className="mt-3"
                  />
                  <input
                    value={ans.text}
                    onChange={(e) => {
                      const next = [...answers];
                      next[i].text = e.target.value;
                      setAnswers(next);
                    }}
                    className="h-10 flex-1 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                    placeholder={`Option ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (answers.length > 2) {
                        setAnswers(answers.filter((_, idx) => idx !== i));
                      }
                    }}
                    disabled={answers.length <= 2}
                    className="px-2 text-zinc-400 hover:text-rose-500 disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAnswers([...answers, { text: "", isCorrect: false }])}
                className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                + Add Option
              </button>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Explanation (Optional)</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="min-h-20 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                placeholder="Why is the correct answer correct?"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {saving ? "Adding..." : "Add Question"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function CasesClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [topics, setTopics] = React.useState<TopicItem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);

  // Create Topic Form
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
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load topics.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

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
      setTitle("");
      setDescription("");
    } catch (e) {
      alert("Failed to create topic.");
    } finally {
      setCreating(false);
    }
  }

  async function onDeleteTopic(id: string) {
    if (!confirm("Delete this topic and all its questions?")) return;
    try {
      const res = await fetch(`/api/cases?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTopics(topics.filter((t) => t.id !== id));
      if (selectedTopicId === id) setSelectedTopicId(null);
    } catch (e) {
      alert("Failed to delete topic.");
    }
  }

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  if (selectedTopic) {
    return (
      <div>
        <section className="min-h-screen border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
          <Container className="py-14">
            <QuizView
              topic={selectedTopic}
              isAdmin={isAdmin}
              onBack={() => setSelectedTopicId(null)}
              onQuizAdded={(q) => {
                const nextTopics = topics.map((t) =>
                  t.id === selectedTopic.id ? { ...t, quizzes: [...t.quizzes, q] } : t,
                );
                setTopics(nextTopics);
              }}
              onQuizDeleted={(qid) => {
                const nextTopics = topics.map((t) =>
                  t.id === selectedTopic.id
                    ? { ...t, quizzes: t.quizzes.filter((x) => x.id !== qid) }
                    : t,
                );
                setTopics(nextTopics);
              }}
            />
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Cases
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Topics
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
              Select a topic to view test cases and quizzes.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <div
                key={t.id}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:hover:bg-zinc-950"
              >
                <div>
                  <h3 className="text-xl font-semibold">{t.title}</h3>
                  {t.description ? (
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
                      {t.description}
                    </p>
                  ) : null}
                  <div className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {t.quizzes.length} Question{t.quizzes.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTopicId(t.id)}
                    className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Open Topic →
                  </button>
                  {isAdmin ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTopic(t.id);
                      }}
                      className="text-xs text-rose-600 hover:underline dark:text-rose-400"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {isAdmin ? (
              <div className="rounded-[2rem] border border-dashed border-black/10 bg-black/5 p-8 dark:border-white/15 dark:bg-white/5">
                <form onSubmit={onCreateTopic} className="h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">New Topic</h3>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Topic Title"
                      className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      required
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creating || !title}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {creating ? "Creating..." : "Create Topic"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>

          {load.status === "loading" && topics.length === 0 ? (
            <div className="mt-10 text-center text-zinc-500">Loading topics...</div>
          ) : null}

          {load.status !== "loading" && topics.length === 0 && !isAdmin ? (
            <div className="mt-10 text-center text-zinc-500">No topics found.</div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
