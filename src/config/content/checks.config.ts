/**
 * Section 11 config: Checks, Recommendations & Book a Call
 * Plus sample campaign review download.
 */

export const checksConfig = {
  sectionId: "checks",
  heading: "Account Health & Direct Booking",
  subheading:
    "When I take over or audit an ad account, I don't guess. Here are the three non-negotiables I inspect on day one, followed by verified recommendations and direct booking.",

  // Three things I check first
  threeChecks: {
    title: "Three things I check first in any account",
    description: "Before touching bids or budget, these three leaks usually cost 20–40% of ad spend.",
    items: [
      {
        number: "01",
        title: "Search terms that waste spend",
        detail:
          "Broad match keywords and loose phrase matching trigger irrelevant, low-intent queries. I scour the search terms report and build rigorous negative keyword lists to stop wasted burn immediately.",
        badge: "Wasted Budget Leak",
      },
      {
        number: "02",
        title: "Conversion tracking that isn't firing properly",
        detail:
          "Double-counting page views as leads, unverified purchase tags, or broken CRM webhooks ruin smart bidding models. I verify pixel firing, offline conversion sync, and deduplication before scaling.",
        badge: "Data Integrity",
      },
      {
        number: "03",
        title: "Budget spread across weak campaigns",
        detail:
          "Spreading ₹1,00,000 across 12 campaigns dilutes algorithm learning. I concentrate 80% of budget into proven, high-converting campaigns while keeping 20% strictly isolated for disciplined A/B testing.",
        badge: "Capital Efficiency",
      },
    ],
  },

  // Short recommendations (Honest card)
  recommendations: {
    title: "Recommendations & Endorsements",
    hasQuotes: false, // Set to true when verified quotes arrive
    placeholderMessage:
      "Client and team lead recommendations are only published with explicit written authorization. Verified quotes from account directors will be updated here.",
    quote: null as null | {
      quote: string;
      author: string;
      role: string;
      company: string;
    },
    note: "Strict policy: No fabricated testimonials. Real work speaks for itself.",
  },

  // Book a 15-minute call
  bookCall: {
    title: "Book a 15-Minute Paid Media Diagnostic",
    description:
      "Have an existing account burning cash, or looking to scale lead generation? Pick a time on my calendar for a quick, no-pitch review of your current performance metrics.",
    calendarUrl: "https://calendly.com", // User can replace with their Calendly / Cal.com link in config
    duration: "15 mins",
    format: "Google Meet / Phone Call",
    perks: [
      "Quick audit of your current CPL vs benchmark",
      "Immediate feedback on keyword match type wastes",
      "Direct answers on Google / Meta / Microsoft Ads strategy",
    ],
    buttonLabel: "Schedule 15-min call →",
  },

  // Extras 2: Sample campaign review
  sampleReport: {
    title: "Sample Campaign Review",
    subtitle: "See exactly how I report to leadership & clients",
    description:
      "A sanitized one-page weekly performance review deck. Keyword wins, budget pacing, CPL variance, and actionable next steps — exactly how high-spending accounts are run.",
    buttonLabel: "See how I report (PDF)",
    downloadUrl: "#lead-calculator", // or direct sample PDF URL
  },
} as const;
