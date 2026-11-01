/**
 * How I Work section configuration
 * Four numbered process cards.
 */

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string; // Emoji icon
}

export const howIWorkConfig: ProcessStep[] = [
  {
    id: "step-audit",
    number: "01",
    title: "Audit",
    description:
      "I start with the data: what is converting, what is wasting spend, and what has changed.",
    icon: "🔍",
  },
  {
    id: "step-prioritise",
    number: "02",
    title: "Prioritise",
    description: "I fix the leaks first, then put budget behind what works.",
    icon: "🎯",
  },
  {
    id: "step-test",
    number: "03",
    title: "Test",
    description:
      "Ad copy, audiences and bids get tested one change at a time, and the winners stay.",
    icon: "⚗️",
  },
  {
    id: "step-report",
    number: "04",
    title: "Report",
    description:
      "I explain results in plain language, with clear recommendations the client can act on.",
    icon: "📊",
  },
];
