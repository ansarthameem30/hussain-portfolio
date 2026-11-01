/**
 * Hero section content configuration
 * Edit headline, subheadline, buttons, and comparison card data here.
 */

export const heroConfig = {
  headline: "Leads up 141%. Cost per lead down 56%.",
  subheadline:
    "Abdul Malik Hussain, Senior Performance Marketer. 4+ years running Google, Microsoft and Meta Ads for multiple clients, growing leads while bringing the cost of each one down.",
  smallLine: "Based in Chennai, India. Open to performance marketing roles.",

  buttons: [
    {
      id: "btn-see-results",
      label: "See my results",
      href: "#results",
      variant: "primary" as const,
    },
    {
      id: "btn-download-resume",
      label: "Download resume",
      href: "/Abdul-Malik-Hussain-Performance-Marketing.pdf",
      variant: "secondary" as const,
      download: true,
    },
    {
      id: "btn-lets-talk",
      label: "Let's talk",
      href: "#contact",
      variant: "ghost" as const,
    },
  ],

  comparisonCard: {
    title: "First account, same dates a year apart",
    period: "January 1 to September 12, 2026 against 2025",
    footnote: "Indexed so that 2025 equals 100. The real figures are confidential.",
    bars: [
      { label: "Leads", from: 100, to: 241, delta: "+141%", positive: true },
      { label: "Spend", from: 100, to: 106, delta: "+5.6%", positive: false },
      { label: "Cost / Lead", from: 100, to: 44, delta: "−56%", positive: true },
    ],
  },
} as const;
