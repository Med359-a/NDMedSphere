export type BookItem = {
  id: string;
  title: string;
  author?: string;
  url?: string;
  notes?: string;
  fileId?: string; // For uploaded PDF
  createdAt: string;
};

export type QuizAnswer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizItem = {
  id: string;
  question: string;
  imageFileId?: string; // Optional image
  answers: QuizAnswer[];
  explanation?: string; // Optional explanation after answer
  createdAt: string;
};

export type TopicItem = {
  id: string;
  title: string;
  description?: string;
  quizzes: QuizItem[];
  createdAt: string;
};

export type StudyItem = {
  id: string;
  title: string;
  notes: string;
  tags: string[];
  createdAt: string;
};

