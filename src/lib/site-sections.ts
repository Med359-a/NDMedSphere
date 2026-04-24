export type BlogPageGroup = "products" | "services";

export type BlogPageConfig = {
  group: BlogPageGroup;
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  href: string;
};

export const RESOURCE_LINKS = [
  { title: "Books", href: "/books" },
  { title: "Cases", href: "/cases" },
  { title: "USMLE", href: "/usmle" },
] as const;

export const PRODUCT_PAGES: BlogPageConfig[] = [
  {
    group: "products",
    slug: "communications-skills",
    title: "Communications Skills",
    eyebrow: "Products",
    intro: "Share blog posts, educational notes, and image-supported guidance about communication in medicine.",
    href: "/products/communications-skills",
  },
  {
    group: "products",
    slug: "preventive-care-management",
    title: "Preventive Care Management",
    eyebrow: "Products",
    intro: "Publish structured posts around preventive care planning, follow-up, and patient-centered management.",
    href: "/products/preventive-care-management",
  },
  {
    group: "products",
    slug: "medical-news",
    title: "Medical News",
    eyebrow: "Products",
    intro: "Publish medical-news posts and image-supported updates in one dedicated page.",
    href: "/medical-news",
  },
  {
    group: "products",
    slug: "lifestyle",
    title: "Lifestyle",
    eyebrow: "Products",
    intro: "Write blog-style posts on healthy living, routines, wellness, and practical patient education.",
    href: "/products/lifestyle",
  },
] as const;

export const SERVICE_PAGES: BlogPageConfig[] = [
  {
    group: "services",
    slug: "simplified-medical-education",
    title: "Simplified Medical Education",
    eyebrow: "Services",
    intro: "Master general medical subjects with clear, structured learning.",
    href: "/services/simplified-medical-education",
  },
  {
    group: "services",
    slug: "personalized-learning-plans",
    title: "Personalized Learning Plans",
    eyebrow: "Services",
    intro: "Tailored guidance based on your goals and level.",
    href: "/services/personalized-learning-plans",
  },
  {
    group: "services",
    slug: "collaborative-group-learning",
    title: "Collaborative Group Learning",
    eyebrow: "Services",
    intro: "Interactive sessions to enhance understanding and retention.",
    href: "/services/collaborative-group-learning",
  },
  {
    group: "services",
    slug: "usmle-preparation",
    title: "USMLE Preparation",
    eyebrow: "Services",
    intro: "Focused support for high-yield exam success.",
    href: "/services/usmle-preparation",
  },
  {
    group: "services",
    slug: "medical-document-organization",
    title: "Medical Document Organization",
    eyebrow: "Services",
    intro: "Efficient structuring and management of clinical materials.",
    href: "/services/medical-document-organization",
  },
  {
    group: "services",
    slug: "professional-cv-development",
    title: "Professional CV Development",
    eyebrow: "Services",
    intro: "Build a strong, competitive medical CV.",
    href: "/services/professional-cv-development",
  },
  {
    group: "services",
    slug: "medical-writing-support",
    title: "Medical Writing Support",
    eyebrow: "Services",
    intro: "Proper structuring and refinement of academic papers.",
    href: "/services/medical-writing-support",
  },
  {
    group: "services",
    slug: "comprehensive-medical-guidance",
    title: "Comprehensive Medical Guidance",
    eyebrow: "Services",
    intro: "In-depth information on a wide range of medical topics.",
    href: "/services/comprehensive-medical-guidance",
  },
  {
    group: "services",
    slug: "clinical-exposure-opportunities",
    title: "Clinical Exposure Opportunities",
    eyebrow: "Services",
    intro: "Attend real clinical procedures and surgical operations.",
    href: "/services/clinical-exposure-opportunities",
  },
] as const;

export const DOCTOR_NICHES = [
  "Neurosurgeon",
  "Neurology",
  "Allergy & Immunology",
  "Bariatric Surgery",
  "Cardiovascular Disease",
  "Child & Adolescent Psychiatry",
  "Chiropractor",
  "Critical Care Medicine",
  "Dentistry",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology, Diabetes & Metabolism",
  "Family Medicine",
  "Gastroenterology",
  "Geriatric Medicine",
  "Hematology",
  "Integrative Medicine",
  "Internal Medicine",
  "Nephrology",
  "Nurse Practitioner",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Optometry",
  "Orthodontics",
  "Orthopedic Surgery",
  "Osteopathic Medicine",
  "Other Specialty",
  "Otolaryngology-Head & Neck Surgery",
  "Pain Medicine",
  "Pediatrics",
  "Plastic Surgery",
  "Podiatry",
  "Psychiatry",
  "Psychology",
  "Pulmonology",
  "Radiation Oncology",
  "Rheumatology",
  "Sports Medicine",
  "Surgery",
  "Surgical Oncology",
  "Urology",
  "Vascular Surgery",
] as const;

export function getBlogPageBySlug(group: BlogPageGroup, slug: string) {
  const source = group === "products" ? PRODUCT_PAGES : SERVICE_PAGES;
  return source.find((page) => page.slug === slug) ?? null;
}
