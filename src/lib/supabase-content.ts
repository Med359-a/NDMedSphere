import "server-only";

import type {
  BookItem,
  QuizAnswer,
  QuizItem,
  StudyItem,
  TopicItem,
  UsmleItem,
} from "@/lib/content-types";
import type { VideoItem } from "@/lib/video-types";
import { toIsoDateString } from "@/lib/content-utils";
import { getSupabaseAdmin } from "@/lib/supabase";

export type BookRow = {
  id: string;
  title: string;
  author: string | null;
  url: string | null;
  notes: string | null;
  file_path: string | null;
  file_name: string | null;
  mime_type: string | null;
  created_at: string;
};

export type CaseTopicRow = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};

export type CaseQuizRow = {
  id: string;
  topic_id: string;
  question: string;
  image_path: string | null;
  explanation: string | null;
  sort_order: number;
  created_at: string;
};

export type CaseQuizAnswerRow = {
  id: string;
  quiz_id: string;
  text: string;
  is_correct: boolean;
  sort_order: number;
  created_at: string;
};

export type MedicalNewsRow = {
  id: string;
  title: string;
  notes: string;
  tags: string[] | null;
  url: string | null;
  image_path: string | null;
  created_at: string;
};

export type UsmleRow = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string | null;
  mime_type: string | null;
  created_at: string;
};

export type VideoRow = {
  id: string;
  title: string;
  description: string;
  youtube_url: string | null;
  file_path: string | null;
  original_name: string | null;
  mime_type: string | null;
  size: number | null;
  created_at: string;
};

export function toBookItem(row: BookRow): BookItem {
  return {
    id: row.id,
    title: row.title,
    author: row.author ?? undefined,
    url: row.url ?? undefined,
    notes: row.notes ?? undefined,
    fileId: row.file_path ?? undefined,
    createdAt: toIsoDateString(row.created_at),
  };
}

export function toStudyItem(row: MedicalNewsRow): StudyItem {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    tags: Array.isArray(row.tags) ? row.tags : [],
    url: row.url ?? undefined,
    imageFileId: row.image_path ?? undefined,
    createdAt: toIsoDateString(row.created_at),
  };
}

export function toUsmleItem(row: UsmleRow): UsmleItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    url: row.url ?? undefined,
    fileId: row.file_path ?? undefined,
    fileName: row.file_name ?? undefined,
    fileType: row.file_type ?? undefined,
    createdAt: toIsoDateString(row.created_at),
  };
}

export function toVideoItem(row: VideoRow): VideoItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    youtubeUrl: row.youtube_url ?? undefined,
    originalName: row.original_name ?? undefined,
    mimeType: row.mime_type ?? undefined,
    size: typeof row.size === "number" ? row.size : undefined,
    createdAt: toIsoDateString(row.created_at),
  };
}

function toQuizItem(quiz: CaseQuizRow, answers: CaseQuizAnswerRow[]): QuizItem {
  const mappedAnswers: QuizAnswer[] = answers.map((answer) => ({
    id: answer.id,
    text: answer.text,
    isCorrect: answer.is_correct,
  }));

  return {
    id: quiz.id,
    question: quiz.question,
    imageFileId: quiz.image_path ?? undefined,
    answers: mappedAnswers,
    explanation: quiz.explanation ?? undefined,
    createdAt: toIsoDateString(quiz.created_at),
  };
}

export async function listCaseTopics(): Promise<TopicItem[]> {
  const supabase = getSupabaseAdmin();

  const { data: topics, error: topicsError } = await supabase
    .from("case_topics")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: false });

  if (topicsError) {
    throw new Error(topicsError.message);
  }

  const topicRows = (topics ?? []) as CaseTopicRow[];
  if (topicRows.length === 0) return [];

  const topicIds = topicRows.map((topic) => topic.id);

  const { data: quizzes, error: quizzesError } = await supabase
    .from("case_quizzes")
    .select("id, topic_id, question, image_path, explanation, sort_order, created_at")
    .in("topic_id", topicIds)
    .order("topic_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (quizzesError) {
    throw new Error(quizzesError.message);
  }

  const quizRows = (quizzes ?? []) as CaseQuizRow[];
  const quizIds = quizRows.map((quiz) => quiz.id);

  let answerRows: CaseQuizAnswerRow[] = [];
  if (quizIds.length > 0) {
    const { data: answers, error: answersError } = await supabase
      .from("case_quiz_answers")
      .select("id, quiz_id, text, is_correct, sort_order, created_at")
      .in("quiz_id", quizIds)
      .order("quiz_id", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (answersError) {
      throw new Error(answersError.message);
    }

    answerRows = (answers ?? []) as CaseQuizAnswerRow[];
  }

  const answersByQuizId = new Map<string, CaseQuizAnswerRow[]>();
  for (const answer of answerRows) {
    const items = answersByQuizId.get(answer.quiz_id);
    if (items) items.push(answer);
    else answersByQuizId.set(answer.quiz_id, [answer]);
  }

  const quizzesByTopicId = new Map<string, QuizItem[]>();
  for (const quiz of quizRows) {
    const item = toQuizItem(quiz, answersByQuizId.get(quiz.id) ?? []);
    const items = quizzesByTopicId.get(quiz.topic_id);
    if (items) items.push(item);
    else quizzesByTopicId.set(quiz.topic_id, [item]);
  }

  return topicRows.map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description ?? undefined,
    quizzes: quizzesByTopicId.get(topic.id) ?? [],
    createdAt: toIsoDateString(topic.created_at),
  }));
}
