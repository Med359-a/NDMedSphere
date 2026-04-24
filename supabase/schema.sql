create table if not exists public.books (
  id text primary key,
  title text not null,
  author text,
  url text,
  notes text,
  file_path text,
  file_name text,
  mime_type text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists books_created_at_idx on public.books (created_at desc);

create table if not exists public.case_topics (
  id text primary key,
  title text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists case_topics_created_at_idx on public.case_topics (created_at desc);

create table if not exists public.case_quizzes (
  id text primary key,
  topic_id text not null references public.case_topics(id) on delete cascade,
  question text not null,
  image_path text,
  explanation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists case_quizzes_topic_id_idx on public.case_quizzes (topic_id);
create unique index if not exists case_quizzes_topic_sort_order_idx
  on public.case_quizzes (topic_id, sort_order);

create table if not exists public.case_quiz_answers (
  id text primary key,
  quiz_id text not null references public.case_quizzes(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists case_quiz_answers_quiz_id_idx on public.case_quiz_answers (quiz_id);
create unique index if not exists case_quiz_answers_quiz_sort_order_idx
  on public.case_quiz_answers (quiz_id, sort_order);

create table if not exists public.medical_news (
  id text primary key,
  title text not null,
  notes text not null,
  tags text[] not null default '{}'::text[],
  url text,
  image_path text,
  page_slug text not null default 'medical-news',
  page_group text not null default 'products',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.medical_news
  add column if not exists page_slug text not null default 'medical-news';

alter table public.medical_news
  add column if not exists page_group text not null default 'products';

create index if not exists medical_news_created_at_idx on public.medical_news (created_at desc);
create index if not exists medical_news_page_slug_idx on public.medical_news (page_slug, created_at desc);

create table if not exists public.doctors (
  id text primary key,
  name text not null,
  biography text not null,
  niche text not null default 'Other Specialty',
  rating integer not null default 5 check (rating between 1 and 5),
  image_path text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.doctors
  add column if not exists niche text not null default 'Other Specialty';

alter table public.doctors
  add column if not exists rating integer not null default 5;

create index if not exists doctors_created_at_idx on public.doctors (created_at desc);
create index if not exists doctors_niche_idx on public.doctors (niche);

create table if not exists public.usmle_resources (
  id text primary key,
  title text not null,
  description text,
  url text,
  file_path text,
  file_name text,
  file_type text check (file_type in ('pdf', 'image')),
  mime_type text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists usmle_resources_created_at_idx
  on public.usmle_resources (created_at desc);

create table if not exists public.videos (
  id text primary key,
  title text not null,
  description text not null default '',
  youtube_url text,
  file_path text,
  original_name text,
  mime_type text,
  size bigint check (size is null or size >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists videos_created_at_idx on public.videos (created_at desc);

alter table public.books enable row level security;
alter table public.case_topics enable row level security;
alter table public.case_quizzes enable row level security;
alter table public.case_quiz_answers enable row level security;
alter table public.doctors enable row level security;
alter table public.medical_news enable row level security;
alter table public.usmle_resources enable row level security;
alter table public.videos enable row level security;
