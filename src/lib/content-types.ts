export type BookItem = {
  id: string;
  title: string;
  author?: string;
  url?: string;
  notes?: string;
  createdAt: string;
};

export type CaseItem = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
};

export type StudyItem = {
  id: string;
  title: string;
  notes: string;
  tags: string[];
  createdAt: string;
};

