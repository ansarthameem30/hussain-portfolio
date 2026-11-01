/**
 * Results & case studies configuration
 * Edit highlight tiles and account case studies here.
 * No client names or ad-spend figures — accounts are numbered.
 */

export interface HighlightTile {
  id: string;
  metric: string;
  label: string;
  positive: boolean;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  positive: boolean;
}

export interface CaseStudy {
  id: string;
  account: string;
  headline: string;
  subline?: string;
  metrics: CaseStudyMetric[];
  whatIDid: string[];
  defaultOpen?: boolean;
}

export const resultsConfig = {
  sectionLabel: "Results",

  highlights: [
    {
      id: "hl-calls",
      metric: "+112.7%",
      label: "Calls on fourth account",
      positive: true,
    },
    {
      id: "hl-cpl",
      metric: "−27.7%",
      label: "Cost per lead, third account",
      positive: true,
    },
    {
      id: "hl-social",
      metric: "+105%",
      label: "Paid social clicks on 40% more impressions",
      positive: true,
    },
    {
      id: "hl-budget",
      metric: "$500K+",
      label: "Extra client budget approved",
      positive: true,
    },
  ] satisfies HighlightTile[],

  caseStudies: [
    {
      id: "case-1",
      account: "First account",
      headline: "More than double the leads on almost the same budget",
      metrics: [
        { label: "Leads", value: "+141%", positive: true },
        { label: "Cost per lead", value: "−56%", positive: true },
        { label: "Spend", value: "+5.6%", positive: false },
      ],
      whatIDid: [
        "Ran ongoing A/B tests on ad copy to lift click-through rate.",
        "Kept cost per lead under control by cutting wasted search terms and moving budget to the best-converting campaigns.",
        "Held cost per click down through bid and keyword adjustments while scaling lead volume.",
      ],
      defaultOpen: true,
    },
    {
      id: "case-2",
      account: "Second account",
      headline: "Scaled spend by 73% and still lowered cost per lead",
      subline:
        "On paid social, clicks grew 105% on just 40% more impressions. The client renewed with a budget about 32% higher.",
      metrics: [
        { label: "Leads", value: "+91%", positive: true },
        { label: "Cost per lead", value: "−9.7%", positive: true },
        { label: "Spend", value: "+72.6%", positive: false },
      ],
      whatIDid: [
        "Scaled spend steadily while checking cost per lead every day, so growth never ran ahead of efficiency.",
        "Tested ad creative and audiences on paid social, and clicks grew 105% on only 40% more impressions.",
        "Kept the client informed with regular performance reviews, and the account renewed with a budget about 32% higher.",
      ],
    },
    {
      id: "case-3",
      account: "Third account",
      headline: "71% more leads at 28% lower cost",
      metrics: [
        { label: "Leads", value: "+71%", positive: true },
        { label: "Cost per lead", value: "−27.7%", positive: true },
      ],
      whatIDid: [
        "Cleaned up search terms and added negative keywords to cut wasteful clicks.",
        "Tuned bids and keywords to lower both cost per click and cost per lead.",
        "Tested new ad copy to raise click-through rate.",
      ],
    },
    {
      id: "case-4",
      account: "Fourth account",
      headline: "Calls more than doubled",
      metrics: [
        { label: "Calls", value: "+112.7%", positive: true },
        { label: "Cost per lead", value: "−24.4%", positive: true },
      ],
      whatIDid: [
        "Optimised campaigns for call conversions and reviewed performance every day.",
        "Tested ad copy to improve click-through rate and bring cost per click down.",
        "Adjusted bids and budgets toward what produced calls at the lowest cost.",
      ],
    },
    {
      id: "case-5",
      account: "Fifth account",
      headline: "Eleven campaigns, more leads and a bigger budget",
      subline: "I managed eleven service-line campaigns for this account.",
      metrics: [
        { label: "Leads", value: "+18.5%", positive: true },
        { label: "Clicks", value: "+46.7%", positive: true },
        { label: "Budget increases", value: "~$155K/yr", positive: true },
      ],
      whatIDid: [
        "Ran eleven service-line campaigns side by side, each with its own keywords, budgets and goals.",
        "Improved click-through rate and cost per click through regular testing and search term clean-up, which lifted clicks by 46.7%.",
        "Backed budget requests with results, which earned about $155K a year in approved increases.",
      ],
    },
  ] satisfies CaseStudy[],
};
