/**
 * Numbers strip configuration
 * Five animated counter stats shown prominently below the hero.
 * Edit label, value, prefix, suffix, and decimals per stat.
 */

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

export const statsConfig: Stat[] = [
  {
    id: "stat-leads",
    value: 141,
    prefix: "+",
    suffix: "%",
    label: "Leads on my best account, with spend up only 5.6%",
  },
  {
    id: "stat-cpl",
    value: 56,
    prefix: "−",
    suffix: "%",
    label: "Cost per lead on that same account",
  },
  {
    id: "stat-years",
    value: 4,
    prefix: "",
    suffix: "+ years",
    label: "Hands-on paid media experience",
  },
  {
    id: "stat-platforms",
    value: 5,
    prefix: "",
    suffix: " platforms",
    label: "Google, Microsoft, Yahoo, Meta and YouTube Ads",
  },
  {
    id: "stat-budget",
    value: 500,
    prefix: "$",
    suffix: "K+",
    label: "Extra client budget approved on the strength of results",
  },
];
