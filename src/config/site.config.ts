/**
 * Site-wide configuration
 * Edit this file to update metadata, SEO, and social links.
 * No code changes needed — just update the values here.
 */

export const siteConfig = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: "Abdul Malik Hussain",
  title: "Abdul Malik Hussain | Senior Performance Marketer, Chennai",
  shortTitle: "Abdul Malik",
  role: "Senior Performance Marketer · Paid Media",
  tagline: "Leads up 141%. Cost per lead down 56%.",
  location: "Chennai, India",
  availability: "Open to performance marketing roles",
  founded: "2026",

  // ─── SEO ───────────────────────────────────────────────────────────────────
  description:
    "Senior Performance Marketer with 4+ years in Google, Microsoft and Meta Ads. Leads up 141%, cost per lead down 56%. See my case studies.",
  keywords: [
    "Performance Marketer",
    "Google Ads",
    "Microsoft Ads",
    "Meta Ads",
    "Paid Media",
    "Lead Generation",
    "PPC",
    "Campaign Manager",
    "Chennai",
    "Digital Marketing",
  ],
  canonicalUrl: "https://abdulmalik.dev", // Update with real domain

  // ─── Open Graph / Social Sharing ───────────────────────────────────────────
  ogImage: "/og-image.png",
  ogImageAlt: "Abdul Malik Hussain – Senior Performance Marketer",
  twitterHandle: "@abdulmalik", // Update if exists

  // ─── Contact ───────────────────────────────────────────────────────────────
  email: "hello@abdulmalik.dev", // Replace with real email
  whatsapp: "+919876543210", // Replace with real number
  whatsappMessage: "Hi Abdul, I came across your portfolio and would like to connect.",
  linkedin: "https://www.linkedin.com/in/malik-hussain-008003222",
  calendarLink: "#book-call", // Replace with Calendly / Cal.com link

  // ─── Assets ────────────────────────────────────────────────────────────────
  resumeUrl: "/Abdul-Malik-Hussain-Performance-Marketing.pdf",
  headshot: "/headshot.jpg", // Add real photo to /public

  // ─── Navigation ────────────────────────────────────────────────────────────
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "Results", href: "#results" },
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Experience", href: "#experience" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
