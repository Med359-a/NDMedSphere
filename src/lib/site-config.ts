export const siteConfig = {
  // Update these to match your branding.
  doctorName: "Dr. Your Name",
  clinicName: "ND MedSphere Clinic",
  tagline: "Modern, evidence-based care with a human touch.",
  specialties: ["Family Medicine", "Preventive Care", "Minor Procedures"],

  // Used for metadata + absolute URLs.
  siteUrl: "http://localhost:3000",
  metaTitle: "ND MedSphere Clinic — Doctor Portfolio & Clinic Website",
  metaDescription:
    "A modern clinic website with services, patient info, and a portfolio page to showcase your work.",

  contact: {
    phone: "+1 (555) 000-0000",
    email: "clinic@example.com",
    address: "123 Clinic Street, Your City",
    hours: [
      { days: "Mon–Fri", time: "9:00–17:00" },
      { days: "Sat", time: "10:00–14:00" },
      { days: "Sun", time: "Closed" },
    ],
  },

  social: {
    instagram: "",
    linkedin: "",
    youtube: "",
  },
} as const;


