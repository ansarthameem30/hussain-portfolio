/**
 * Site-wide configuration
 * Synced with Abdul Malik Hussain's resume and portfolio CMS.
 */

export const siteConfig = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: "Abdul Malik Hussain",
  title: "Abdul Malik Hussain | Senior Campaign Manager & Paid Media Specialist",
  shortTitle: "Abdul Malik",
  role: "Senior Campaign Manager · Paid Media & SEM Specialist",
  tagline: "Leads up 141%. Cost per lead down 56%.",
  location: "Chennai, Tamil Nadu, India",
  availability: "Open to senior campaign management & performance marketing roles",
  founded: "2026",

  // ─── SEO ───────────────────────────────────────────────────────────────────
  description:
    "Senior Performance Marketer with 4+ years in Google, Microsoft and Meta Ads. My team's book of business is about $4–5M a month, with $500K+ in approved budget growth. Leads up 141%, cost per lead down 56%.",
  keywords: [
    "Abdul Malik Hussain",
    "Senior Campaign Manager",
    "Performance Marketer",
    "Paid Media Specialist",
    "Google Ads",
    "Microsoft Ads",
    "Meta Ads",
    "SEM Specialist",
    "YouTube Ads",
    "Lead Generation",
    "PPC",
    "Chennai",
    "Digital Marketing",
  ],
  canonicalUrl: "https://hussain-portfolio-tau.vercel.app",

  // ─── Open Graph / Social Sharing ───────────────────────────────────────────
  ogImage: "/og-image.png",
  ogImageAlt: "Abdul Malik Hussain – Senior Campaign Manager & Paid Media Specialist",
  twitterHandle: "@abdulmalik",

  // ─── Contact ───────────────────────────────────────────────────────────────
  email: "malikhussain3013@gmail.com",
  phone: "+91-7395879451",
  whatsapp: "+917395879451",
  whatsappMessage: "Hi Abdul, I came across your portfolio and would like to discuss campaign management / performance marketing opportunities.",
  linkedin: "https://www.linkedin.com/in/malik-hussain-008003222",
  calendarLink: "#book-call",

  // ─── Assets ────────────────────────────────────────────────────────────────
  resumeUrl: "/Abdul-Malik-Hussain-Performance-Marketing.pdf",
  headshot: "/headshot.jpg",

  // ─── Navigation ────────────────────────────────────────────────────────────
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "Results", href: "#results" },
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Timeline", href: "#experience" },
    { label: "Certifications", href: "#certifications" },
    { label: "Creative", href: "#creative" },
    { label: "How I Work", href: "#how-i-work" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
