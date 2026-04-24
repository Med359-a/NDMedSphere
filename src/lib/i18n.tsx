"use client";

import * as React from "react";

export type Language = "en" | "ka";

export const dictionary = {
  en: {
    nav: {
      home: "Home",
      resources: "Resources",
      medications: "Medications",
      products: "Products",
      services: "Services",
      about: "About",
      doctors: "Doctors",
      books: "Books",
      usmle: "USMLE",
      cases: "Cases",
      videos: "Videos",
      news: "Medical News",
      contact: "Contact",
    },
    home: {
      tagline_badge: "Doctor portfolio • Media library & case walkthroughs",
      tagline_main: "Procedures, education, and clinical walkthroughs — documented with clarity.",
      cta_videos: "Open library",
      cta_contact: "Contact",
      focus_areas: ["Procedures", "Patient education", "Case reviews"],
      feature_1: { k: "Focus", v: "Practical demos" },
      feature_2: { k: "Style", v: "Clear explanations" },
      feature_3: { k: "Output", v: "Media library" },
      grid_1: { title: "Clear communication", body: "Short, structured explanations that make complex topics easy to follow." },
      grid_2: { title: "High standards", body: "Careful technique, consistent documentation, and thoughtful walkthroughs." },
      grid_3: { title: "Work content", body: "A dedicated media library keeps videos and images organized in one place." },
      portfolio_title: "Work content — organized and easy to browse",
      portfolio_body: "Browse through my collection of medical videos, reference images, case studies, and procedure walkthroughs.",
      portfolio_link: "Open library",
      card_1: { title: "Browse", body: "Explore a curated library of medical cases and educational content." },
      card_2: { title: "Learn", body: "Watch detailed procedure demos and open reference images." },
      card_3: { title: "Connect", body: "Reach out for collaborations or to discuss medical topics." },
      bottom_title: "A modern portfolio — with a media library built in",
      bottom_body: "Explore my latest work and educational media in the library.",
      bottom_cta: "Open library",
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
      intro: "The website was created as an independent medical education platform dedicated to the dissemination of evidence-based, structured, and clinically relevant medical knowledge.",
      glance: "At a glance",
      focus: "Focus areas",
      approach_title: "Platform Content",
      approach_body_1: "The platform reflects my academic interests, materials developed throughout the learning process, and approaches grounded in contemporary international medical sources. The content includes educational videos, clinical case discussions, medical imaging, and current international guidelines.",
      approach_body_2: "The material is structured with the aim of presenting complex medical topics clearly, systematically, and in a practical manner, with an emphasis on clinical reasoning and analytical thinking rather than passive information delivery.",
      cards: [
        { title: "For medical professionals", body: "Content intended for medical students, residents, and healthcare professionals focused on continuous professional development." },
        { title: "Evidence-based", body: "Grounded in international medical standards and contemporary scientific evidence." },
        { title: "Continuously updated", body: "Regularly reviewed and updated in accordance with new research and international recommendations." },
        { title: "Practical approach", body: "Emphasis on clinical reasoning and analytical thinking rather than passive information delivery." },
      ]
    },
    doctors: {
      eyebrow: "Doctors",
      title: "Meet the doctors",
      intro: "Browse doctor profiles with photos, niches, ratings, and professional biographies.",
      admin_card_title: "Add doctor",
      admin_card_body: "Upload a name, profile photo, biography, niche, and rating. Editing is admin-only.",
      related_title: "Professional profiles",
      related_body: "Each profile can include a portrait, a specialty niche, a star rating, and a short professional biography.",
      related_about: "About the platform",
      related_contact: "Contact",
      name_label: "Doctor name",
      name_placeholder: "Dr. Full Name",
      niche_label: "Niche",
      rating_label: "Rating",
      rating_hint: "Choose up to 5 stars",
      biography_label: "Biography",
      biography_placeholder: "Professional background, specialties, achievements, and a short introduction...",
      photo_label: "Photo (optional)",
      photo_hint: "JPEG, PNG, or WebP up to 10MB",
      selected_prefix: "Selected:",
      add_button: "Add doctor",
      adding_button: "Saving…",
      list_title: "Doctor profiles",
      list_body: "Uploaded doctors will appear here.",
      filter_label: "Filter by niche",
      filter_all: "All niches",
      filter_clear: "Clear filter",
      filter_results_prefix: "Showing",
      filter_results_suffix: "doctor(s)",
      filter_empty_title: "No doctors match this niche yet",
      filter_empty_body: "Try another niche or clear the current filter.",
      refresh: "Refresh",
      biography_heading: "Biography",
      empty_title: "No doctors yet",
      empty_admin_body: "Add your first doctor using the form above.",
      empty_public_body: "Check back soon.",
    }
  },
  ka: {
    nav: {
      home: "მთავარი",
      resources: "რესურსები",
      medications: "მედიკამენტები",
      products: "პროდუქტები",
      services: "სერვისები",
      about: "შესახებ",
      doctors: "ექიმები",
      books: "წიგნები",
      usmle: "USMLE",
      cases: "ქეისები",
      videos: "ვიდეოები",
      news: "სიახლეები",
      contact: "კონტაქტი",
    },
    home: {
      tagline_badge: "ექიმის პორტფოლიო • მედია ბიბლიოთეკა და ქეისები",
      tagline_main: "პროცედურები, განათლება და კლინიკური მიმოხილვები — მკაფიოდ დოკუმენტირებული.",
      cta_videos: "ბიბლიოთეკის გახსნა",
      cta_contact: "კონტაქტი",
      focus_areas: ["პროცედურები", "პაციენტთა განათლება", "ქეისების განხილვა"],
      feature_1: { k: "ფოკუსი", v: "პრაქტიკული დემოები" },
      feature_2: { k: "სტილი", v: "მკაფიო ახსნა" },
      feature_3: { k: "შედეგი", v: "მედია ბიბლიოთეკა" },
      grid_1: { title: "მკაფიო კომუნიკაცია", body: "მოკლე, სტრუქტურირებული ახსნა, რაც რთულ თემებს გასაგებს ხდის." },
      grid_2: { title: "მაღალი სტანდარტები", body: "ფრთხილი ტექნიკა, თანმიმდევრული დოკუმენტაცია და გააზრებული მიმოხილვები." },
      grid_3: { title: "ნამუშევრები", body: "გამოყოფილი მედია ბიბლიოთეკა ვიდეოებსა და სურათებს ერთ სივრცეში აერთიანებს." },
      portfolio_title: "ნამუშევრები — ორგანიზებული და ადვილად დასათვალიერებელი",
      portfolio_body: "დაათვალიერეთ ჩემი სამედიცინო ვიდეოების, სარეფერენცო სურათების, ქეისებისა და პროცედურების კოლექცია.",
      portfolio_link: "ბიბლიოთეკის გახსნა",
      card_1: { title: "დათვალიერება", body: "გამოიკვლიეთ სამედიცინო ქეისებისა და საგანმანათლებლო მასალების ბიბლიოთეკა." },
      card_2: { title: "სწავლა", body: "უყურეთ დეტალურ პროცედურულ დემოებს და გახსენით სარეფერენცო სურათები." },
      card_3: { title: "დაკავშირება", body: "დაგვიკავშირდით თანამშრომლობისთვის ან სამედიცინო თემების განსახილველად." },
      bottom_title: "თანამედროვე პორტფოლიო — ჩაშენებული მედია ბიბლიოთეკით",
      bottom_body: "გამოიკვლიეთ ჩემი უახლესი ნამუშევრები და საგანმანათლებლო მედია ბიბლიოთეკაში.",
      bottom_cta: "ბიბლიოთეკის გახსნა",
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
      intro: "ვებსაიტი შეიქმნა როგორც დამოუკიდებელი სამედიცინო განათლების პლატფორმა, რომელიც ეძღვნება მტკიცებულებებზე დაფუძნებული, სტრუქტურირებული და კლინიკურად აქტუალური სამედიცინო ცოდნის გავრცელებას.",
      glance: "მიმოხილვა",
      focus: "ფოკუსირების სფეროები",
      approach_title: "პლატფორმის შინაარსი",
      approach_body_1: "პლატფორმა ასახავს ჩემს აკადემიურ ინტერესებს, სწავლის პროცესში განვითარებულ მასალებს და თანამედროვე საერთაშორისო სამედიცინო წყაროებზე დაფუძნებულ მიდგომებს. შინაარსი მოიცავს საგანმანათლებლო ვიდეოებს, კლინიკური ქეისების განხილვებს, სამედიცინო სამკვეთო მასალებს და დღესდღეობით მოქმედ საერთაშორისო სახელმძღვანელოებს.",
      approach_body_2: "მასალა სტრუქტურირებულია რთული სამედიცინო თემების ნათლად, სისტემატიურად და პრაქტიკული ხერხით წარმოდგენის მიზნით, კლინიკური მსჯელობისა და ანალიტიკური აზროვნების ხაზგასმით, პასიური ინფორმაციის გადაცემის ნაცვლად.",
      cards: [
        { title: "სამედიცინო პროფესიონალებისთვის", body: "შინაარსი განკუთვნილია სამედიცინო სტუდენტებისთვის, რეზიდენტებისთვის და ჯანდაცვის მუშაკებისთვის, რომლებიც ფოკუსირებულია პროფესიული განვითარებაზე." },
        { title: "მტკიცებულებებზე დაფუძნებული", body: "დაფუძნებული საერთაშორისო სამედიცინო სტანდარტებზე და თანამედროვე სამეცნიერო მტკიცებულებებზე." },
        { title: "მუდმივად განახლებული", body: "რეგულარულად გადამოწმებული და განახლებული ახალი კვლევებისა და საერთაშორისო რეკომენდაციების შესაბამისად." },
        { title: "პრაქტიკული მიდგომა", body: "კლინიკური მსჯელობის და ანალიტიკური აზროვნების ხაზგასმა პასიური ინფორმაციის გადაცემის ნაცვლად." },
      ]
    },
    doctors: {
      eyebrow: "ექიმები",
      title: "გაიცანით ექიმები",
      intro: "დაათვალიერეთ ექიმების პროფილები ფოტოებით, მიმართულებებით, შეფასებებითა და პროფესიული ბიოგრაფიებით.",
      admin_card_title: "ექიმის დამატება",
      admin_card_body: "ატვირთეთ სახელი, პროფილის ფოტო, ბიოგრაფია, მიმართულება და შეფასება. რედაქტირება მხოლოდ ადმინისთვისაა ხელმისაწვდომი.",
      related_title: "პროფესიული პროფილები",
      related_body: "თითოეული პროფილი შეიძლება მოიცავდეს ფოტოს, სპეციალიზაციის მიმართულებას, ვარსკვლავებით შეფასებას და მოკლე პროფესიულ ბიოგრაფიას.",
      related_about: "პლატფორმის შესახებ",
      related_contact: "კონტაქტი",
      name_label: "ექიმის სახელი",
      name_placeholder: "დრ. სახელი გვარი",
      niche_label: "მიმართულება",
      rating_label: "შეფასება",
      rating_hint: "აირჩიეთ მაქსიმუმ 5 ვარსკვლავი",
      biography_label: "ბიოგრაფია",
      biography_placeholder: "პროფესიული გამოცდილება, სპეციალიზაცია, მიღწევები და მოკლე გაცნობა...",
      photo_label: "ფოტო (არასავალდებულო)",
      photo_hint: "JPEG, PNG ან WebP მაქსიმუმ 10MB",
      selected_prefix: "არჩეულია:",
      add_button: "დამატება",
      adding_button: "ინახება…",
      list_title: "ექიმების პროფილები",
      list_body: "ატვირთული ექიმები აქ გამოჩნდება.",
      filter_label: "ფილტრი მიმართულების მიხედვით",
      filter_all: "ყველა მიმართულება",
      filter_clear: "ფილტრის გასუფთავება",
      filter_results_prefix: "ნაჩვენებია",
      filter_results_suffix: "ექიმი",
      filter_empty_title: "ამ მიმართულებით ექიმები ჯერ არ არის დამატებული",
      filter_empty_body: "სცადეთ სხვა მიმართულება ან გაასუფთავეთ ფილტრი.",
      refresh: "განახლება",
      biography_heading: "ბიოგრაფია",
      empty_title: "ექიმები ჯერ არ არის დამატებული",
      empty_admin_body: "დაამატეთ პირველი ექიმი ზემოთ არსებული ფორმიდან.",
      empty_public_body: "მალე დავამატებთ პროფილებს.",
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
