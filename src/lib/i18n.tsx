"use client";

import * as React from "react";

export type Language = "en" | "ka";

export const dictionary = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      books: "Books",
      usmle: "USMLE",
      cases: "Cases",
      videos: "Videos",
      news: "Medical News",
      contact: "Contact",
    },
    home: {
      tagline_badge: "Doctor portfolio • Videos & case walkthroughs",
      tagline_main: "Procedures, education, and clinical walkthroughs — documented with clarity.",
      cta_videos: "View videos",
      cta_contact: "Contact",
      focus_areas: ["Procedures", "Patient education", "Case reviews"],
      feature_1: { k: "Focus", v: "Practical demos" },
      feature_2: { k: "Style", v: "Clear explanations" },
      feature_3: { k: "Output", v: "Video portfolio" },
      grid_1: { title: "Clear communication", body: "Short, structured explanations that make complex topics easy to follow." },
      grid_2: { title: "High standards", body: "Careful technique, consistent documentation, and thoughtful walkthroughs." },
      grid_3: { title: "Work content", body: "A dedicated Videos page, organized work content in one place." },
      portfolio_title: "Work content — organized and easy to browse",
      portfolio_body: "Browse through my collection of medical videos, case studies, and procedure walkthroughs.",
      portfolio_link: "Open Videos",
      card_1: { title: "Browse", body: "Explore a curated library of medical cases and educational content." },
      card_2: { title: "Learn", body: "Watch detailed procedure demos and clinical explanations." },
      card_3: { title: "Connect", body: "Reach out for collaborations or to discuss medical topics." },
      bottom_title: "A modern portfolio — with a videos gallery built in",
      bottom_body: "Explore my latest work and educational videos in the gallery.",
      bottom_cta: "View videos",
    },
    footer: {
      about: "About",
      contact: "Contact",
      quick_links: "Quick links",
      rights: "All rights reserved.",
      tagline: "Procedures, education, and clinical walkthroughs — documented with clarity.",
    },
    contact: {
      title: "Let’s connect",
      intro: "Feel free to reach out for collaborations or inquiries.",
      details: "Contact details",
      social: "Social",
      personal_studying: "Personal Studying",
      personal_studying_body: "Contact me for personal studying or mentorship opportunities.",
      send_email: "Send email",
    },
    about: {
      title: "About",
      intro: "I am a medical student with a strong academic foundation and a clear commitment to continuous professional development. I actively pursue in-depth medical education, balancing theoretical knowledge with practical application in clinical settings.",
      glance: "At a glance",
      focus: "Focus areas",
      approach_title: "Approach",
      approach_body_1: "I participate in medical research projects, which allows me to develop critical thinking skills, analytical reasoning, and a solid understanding of evidence-based medicine. I have a strong command of core medical subjects and am capable of effectively teaching and explaining complex medical concepts to others.",
      approach_body_2: "In parallel with my studies, I am gaining hands-on clinical experience in a neurosurgery department, where I am exposed to real-world medical practice and advanced clinical decision-making. My goal is to integrate knowledge, research, and clinical experience to provide high-quality, patient-centered medical care.",
      cards: [
        { title: "Evidence‑based", body: "Grounded in best practices, explained simply." },
        { title: "Clear structure", body: "Short formats that get to the point quickly." },
        { title: "Practical demos", body: "Walkthroughs focused on technique and safety." },
        { title: "Professional standards", body: "Clean presentation and careful documentation." },
      ]
    }
  },
  ka: {
    nav: {
      home: "მთავარი",
      about: "შესახებ",
      books: "წიგნები",
      usmle: "USMLE",
      cases: "ქეისები",
      videos: "ვიდეოები",
      news: "სიახლეები",
      contact: "კონტაქტი",
    },
    home: {
      tagline_badge: "ექიმის პორტფოლიო • ვიდეოები და ქეისები",
      tagline_main: "პროცედურები, განათლება და კლინიკური მიმოხილვები — მკაფიოდ დოკუმენტირებული.",
      cta_videos: "ვიდეოების ნახვა",
      cta_contact: "კონტაქტი",
      focus_areas: ["პროცედურები", "პაციენტთა განათლება", "ქეისების განხილვა"],
      feature_1: { k: "ფოკუსი", v: "პრაქტიკული დემოები" },
      feature_2: { k: "სტილი", v: "მკაფიო ახსნა" },
      feature_3: { k: "შედეგი", v: "ვიდეო პორტფოლიო" },
      grid_1: { title: "მკაფიო კომუნიკაცია", body: "მოკლე, სტრუქტურირებული ახსნა, რაც რთულ თემებს გასაგებს ხდის." },
      grid_2: { title: "მაღალი სტანდარტები", body: "ფრთხილი ტექნიკა, თანმიმდევრული დოკუმენტაცია და გააზრებული მიმოხილვები." },
      grid_3: { title: "ნამუშევრები", body: "გამოყოფილი ვიდეო გვერდი, ორგანიზებული შინაარსი ერთ ადგილას." },
      portfolio_title: "ნამუშევრები — ორგანიზებული და ადვილად დასათვალიერებელი",
      portfolio_body: "დაათვალიერეთ ჩემი სამედიცინო ვიდეოების, ქეისების და პროცედურების კოლექცია.",
      portfolio_link: "ვიდეოების გახსნა",
      card_1: { title: "დათვალიერება", body: "გამოიკვლიეთ სამედიცინო ქეისებისა და საგანმანათლებლო მასალების ბიბლიოთეკა." },
      card_2: { title: "სწავლა", body: "უყურეთ დეტალურ პროცედურულ დემოებს და კლინიკურ განმარტებებს." },
      card_3: { title: "დაკავშირება", body: "დაგვიკავშირდით თანამშრომლობისთვის ან სამედიცინო თემების განსახილველად." },
      bottom_title: "თანამედროვე პორტფოლიო — ჩაშენებული ვიდეო გალერეით",
      bottom_body: "გამოიკვლიეთ ჩემი უახლესი ნამუშევრები და საგანმანათლებლო ვიდეოები გალერეაში.",
      bottom_cta: "ვიდეოების ნახვა",
    },
    footer: {
      about: "შესახებ",
      contact: "კონტაქტი",
      quick_links: "ბმულები",
      rights: "ყველა უფლება დაცულია.",
      tagline: "პროცედურები, განათლება და კლინიკური მიმოხილვები — მკაფიოდ დოკუმენტირებული.",
    },
    contact: {
      title: "დაკავშირება",
      intro: "შეგიძლიათ დაგვიკავშირდეთ თანამშრომლობისთვის ან კითხვებისთვის.",
      details: "საკონტაქტო დეტალები",
      social: "სოციალური ქსელები",
      personal_studying: "პერსონალური სწავლება",
      personal_studying_body: "დამიკავშირდით პერსონალური სწავლების ან მენტორობის შესახებ.",
      send_email: "ელ-ფოსტის გაგზავნა",
    },
    about: {
      title: "შესახებ",
      intro: "მე ვარ სამედიცინო სტუდენტი ძლიერი აკადემიური საფუძვლით და პროფესიული განვითარების მკაფიო ვალდებულებით. აქტიურად ვეუფლები ღრმა სამედიცინო განათლებას, ვაბალანსებ თეორიულ ცოდნას კლინიკურ გარემოში პრაქტიკული გამოყენებით.",
      glance: "მიმოხილვა",
      focus: "ფოკუსირების სფეროები",
      approach_title: "მიდგომა",
      approach_body_1: "ვმონაწილეობ სამედიცინო კვლევით პროექტებში, რაც საშუალებას მაძლევს განვივითარო კრიტიკული აზროვნების უნარები, ანალიტიკური მსჯელობა და მტკიცებულებებზე დაფუძნებული მედიცინის მყარი გაგება. მაქვს ძირითადი სამედიცინო საგნების ძლიერი ცოდნა და შემიძლია ეფექტურად ვასწავლო და ავხსნა რთული სამედიცინო კონცეფციები.",
      approach_body_2: "სწავლის პარალელურად, ვიღებ პრაქტიკულ კლინიკურ გამოცდილებას ნეიროქირურგიის დეპარტამენტში, სადაც ვეცნობი რეალურ სამედიცინო პრაქტიკას და კლინიკური გადაწყვეტილების მიღების პროცესს. ჩემი მიზანია გავაერთიანო ცოდნა, კვლევა და კლინიკური გამოცდილება მაღალი ხარისხის, პაციენტზე ორიენტირებული სამედიცინო მომსახურების მისაწოდებლად.",
      cards: [
        { title: "მტკიცებულებებზე დაფუძნებული", body: "დაფუძნებული საუკეთესო პრაქტიკაზე, ახსნილი მარტივად." },
        { title: "მკაფიო სტრუქტურა", body: "მოკლე ფორმატები, რომლებიც პირდაპირ საქმეზე გადადის." },
        { title: "პრაქტიკული დემოები", body: "ტექნიკასა და უსაფრთხოებაზე ფოკუსირებული მიმოხილვები." },
        { title: "პროფესიული სტანდარტები", body: "სუფთა პრეზენტაცია და ფრთხილი დოკუმენტაცია." },
      ]
    }
  }
};

export type Dictionary = typeof dictionary.en;

const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage, default to 'en'
  const [language, setLanguageState] = React.useState<Language>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "ka")) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = dictionary[language];

  if (!mounted) {
    // Return with default 'en' to match server render initially (avoid hydration mismatch),
    // or just render nothing. Here we match server default (en).
    // Actually, to be safe against hydration errors, we can just render the provider 
    // but the children might render with 'en' then switch to 'ka'.
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
