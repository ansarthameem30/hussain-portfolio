/**
 * Creative Gallery config (Section 10: "The creative side")
 * 12 tiles: 6 reels and 6 posts across 6 industries:
 * Home services, Healthcare, Motorsports, Real estate, Jewellery, Fashion.
 * Pure config-based structure — easy to edit and customize.
 */

export type CreativeCategory =
  | "all"
  | "home-services"
  | "healthcare"
  | "motorsports"
  | "real-estate"
  | "jewellery"
  | "fashion";

export interface CreativeItem {
  id: string;
  title: string;
  format: "reel" | "post";
  category: Exclude<CreativeCategory, "all">;
  categoryLabel: string;
  hook: string;
  description: string;
  duration?: string;
  ratio: "9:16" | "1:1" | "4:5";
  tags: string[];
  performanceHighlight: string;
  colorScheme: {
    bg: string;
    accent: string;
    badge: string;
  };
}

export const creativeConfig = {
  sectionId: "creative",
  heading: "The creative side",
  disclaimer: "Recreated samples. The original client work is confidential.",
  subheading:
    "Performance marketing isn't just bidding and keywords — it's creative that arrests the scroll. 12 sample assets designed for high-CTR conversion across 6 industries.",

  categories: [
    { id: "all" as const, label: "All creative (12)" },
    { id: "home-services" as const, label: "Home Services" },
    { id: "healthcare" as const, label: "Healthcare" },
    { id: "motorsports" as const, label: "Motorsports" },
    { id: "real-estate" as const, label: "Real Estate" },
    { id: "jewellery" as const, label: "Jewellery" },
    { id: "fashion" as const, label: "Fashion" },
  ],

  items: [
    // 1. Home Services - Reel
    {
      id: "creative-hs-reel",
      title: "HVAC Emergency Hook",
      format: "reel",
      category: "home-services",
      categoryLabel: "Home Services",
      hook: "“AC stopped at 2 AM in July? Here's who actually picks up.”",
      description:
        "Fast-paced pain-point reel showing immediate response guarantee and verified technician dispatch within 45 mins.",
      duration: "12s",
      ratio: "9:16",
      tags: ["Emergency Dispatch", "Meta Video", "Call-to-Action"],
      performanceHighlight: "Tested 4.1% CTR · High hook retention",
      colorScheme: {
        bg: "linear-gradient(145deg, #0a1813, #040907)",
        accent: "#38bdf8",
        badge: "Emergency HVAC",
      },
    },
    // 2. Home Services - Post
    {
      id: "creative-hs-post",
      title: "Transparent Pricing Breakdown",
      format: "post",
      category: "home-services",
      categoryLabel: "Home Services",
      hook: "No surprise invoices. Fixed diagnostic fee.",
      description:
        "High-contrast carousel slide comparing hidden contractor fees vs transparent flat rates.",
      ratio: "1:1",
      tags: ["Trust Builder", "Local Leads", "Meta Carousel"],
      performanceHighlight: "-34% CPL vs generic offer",
      colorScheme: {
        bg: "linear-gradient(145deg, #0d1e18, #050d0a)",
        accent: "#ffd23f",
        badge: "Plumbing & Electrical",
      },
    },
    // 3. Healthcare - Reel
    {
      id: "creative-health-reel",
      title: "Same-Day Orthopedic Booking",
      format: "reel",
      category: "healthcare",
      categoryLabel: "Healthcare",
      hook: "“Knee pain keeping you off the field this weekend?”",
      description:
        "Direct patient-centric motion graphic leading directly into one-click WhatsApp appointment scheduler.",
      duration: "12s",
      ratio: "9:16",
      tags: ["Patient Acquisition", "Direct Booking", "Meta Video"],
      performanceHighlight: "2.4x higher conversion than display",
      colorScheme: {
        bg: "linear-gradient(145deg, #081a1d, #030a0c)",
        accent: "#10b981",
        badge: "Sports Medicine",
      },
    },
    // 4. Healthcare - Post
    {
      id: "creative-health-post",
      title: "Doctor Credibility Spotlight",
      format: "post",
      category: "healthcare",
      categoryLabel: "Healthcare",
      hook: "15+ Years Specialization. 2,000+ Successful Procedures.",
      description:
        "Clean, trustworthy aesthetic highlighting surgeon credentials and authentic patient outcome statistics.",
      ratio: "4:5",
      tags: ["Authority Building", "Lead Gen", "Meta Static"],
      performanceHighlight: "+112% phone calls generated",
      colorScheme: {
        bg: "linear-gradient(145deg, #0a1f1b, #040f0d)",
        accent: "#34d399",
        badge: "Specialist Clinic",
      },
    },
    // 5. Motorsports - Reel
    {
      id: "creative-motor-reel",
      title: "Exhaust Note Soundwave Hook",
      format: "reel",
      category: "motorsports",
      categoryLabel: "Motorsports",
      hook: "Turn up your volume. That’s what precision tuning sounds like.",
      description:
        "High-adrenaline short video syncing dyno-run audio with staged performance upgrade milestones.",
      duration: "12s",
      ratio: "9:16",
      tags: ["Sound First", "Enthusiast Audience", "Reels/TikTok"],
      performanceHighlight: "68% 3-sec thumb-stop rate",
      colorScheme: {
        bg: "linear-gradient(145deg, #18110e, #0a0604)",
        accent: "#f97316",
        badge: "Performance Tuning",
      },
    },
    // 6. Motorsports - Post
    {
      id: "creative-motor-post",
      title: "Track Day Spec Comparison",
      format: "post",
      category: "motorsports",
      categoryLabel: "Motorsports",
      hook: "+42 WHP. -0.4s 0-60mph. Street legal warranty.",
      description:
        "Data-dense visual graphic built for gearheads who prioritize real telemetry and dyno sheets over fluff.",
      ratio: "1:1",
      tags: ["Dyno Verified", "High Intent", "Search & Social"],
      performanceHighlight: "+145% click-through rate angle",
      colorScheme: {
        bg: "linear-gradient(145deg, #160e14, #080407)",
        accent: "#fb7185",
        badge: "Track Prep",
      },
    },
    // 7. Real Estate - Reel
    {
      id: "creative-re-reel",
      title: "Walkthrough with Actual Price",
      format: "reel",
      category: "real-estate",
      categoryLabel: "Real Estate",
      hook: "“No ‘DM for price’. Here’s exactly what ₹1.2 Cr buys in OMR.”",
      description:
        "Busts real estate cliches by disclosing genuine pricing upfront, eliminating unqualified leads instantly.",
      duration: "12s",
      ratio: "9:16",
      tags: ["Price Transparency", "Qualified Buyer", "Instagram Reel"],
      performanceHighlight: "-48% unqualified lead inquiries",
      colorScheme: {
        bg: "linear-gradient(145deg, #0e1620, #05080c)",
        accent: "#60a5fa",
        badge: "Luxury Gated Community",
      },
    },
    // 8. Real Estate - Post
    {
      id: "creative-re-post",
      title: "Rental Yield & ROI Snapshot",
      format: "post",
      category: "real-estate",
      categoryLabel: "Real Estate",
      hook: "8.4% Projected Yield · IT Corridor Chennai",
      description:
        "Targeted at NRI & IT investors comparing commercial vs residential rental returns with amortization graph.",
      ratio: "4:5",
      tags: ["Investor Angle", "High Ticket", "Meta Lead Form"],
      performanceHighlight: "High-net-worth lead qualification",
      colorScheme: {
        bg: "linear-gradient(145deg, #0e1c17, #050c0a)",
        accent: "#ffd23f",
        badge: "Commercial & Resid.",
      },
    },
    // 9. Jewellery - Reel
    {
      id: "creative-jewel-reel",
      title: "Macro Sparkle & Hallmark Verification",
      format: "reel",
      category: "jewellery",
      categoryLabel: "Jewellery",
      hook: "Look for the laser-etched BIS Hallmark. Here’s how.",
      description:
        "Macro close-up video establishing authenticity, hallmark purity, and heritage craftsmanship.",
      duration: "12s",
      ratio: "9:16",
      tags: ["BIS 916", "Heritage Trust", "Wedding Season"],
      performanceHighlight: "+85% save rate on Meta",
      colorScheme: {
        bg: "linear-gradient(145deg, #1c180a, #0b0903)",
        accent: "#facc15",
        badge: "Handcrafted Bridal",
      },
    },
    // 10. Jewellery - Post
    {
      id: "creative-jewel-post",
      title: "Modern Minimal Daily Wear",
      format: "post",
      category: "jewellery",
      categoryLabel: "Jewellery",
      hook: "Fine 18K gold engineered for desk-to-dinner elegance.",
      description:
        "Lifestyle product aesthetic pairing light gold jewellery with contemporary office workwear.",
      ratio: "1:1",
      tags: ["Everyday Luxury", "Young Professional", "Catalog Ad"],
      performanceHighlight: "4.2% purchase conversion rate",
      colorScheme: {
        bg: "linear-gradient(145deg, #1a0e10, #0a0405)",
        accent: "#f472b6",
        badge: "Contemporary 18K",
      },
    },
    // 11. Fashion - Reel
    {
      id: "creative-fashion-reel",
      title: "One Shirt, 3 Workday Outfits",
      format: "reel",
      category: "fashion",
      categoryLabel: "Fashion",
      hook: "Client meeting, deep work, dinner drinks.",
      description:
        "Snappy transition reel demonstrating versatility of wrinkle-free cotton linen apparel for men.",
      duration: "12s",
      ratio: "9:16",
      tags: ["Style Transitions", "Capsule Wardrobe", "Meta D2C"],
      performanceHighlight: "+40% repeat click-throughs",
      colorScheme: {
        bg: "linear-gradient(145deg, #111a14, #060b08)",
        accent: "#a7f3d0",
        badge: "Menswear Basics",
      },
    },
    // 12. Fashion - Post
    {
      id: "creative-fashion-post",
      title: "Fabric Longevity & Fit Guarantee",
      format: "post",
      category: "fashion",
      categoryLabel: "Fashion",
      hook: "Zero shrink guarantee. Free exchange in 48 hours.",
      description:
        "Removes the #1 objection in online apparel purchasing (fit risk and fabric quality after first wash).",
      ratio: "4:5",
      tags: ["Objection Killer", "D2C Scaling", "Lookbook Ad"],
      performanceHighlight: "-22% return rate objection",
      colorScheme: {
        bg: "linear-gradient(145deg, #140f1c, #07040c)",
        accent: "#c084fc",
        badge: "Premium Linens",
      },
    },
  ] as CreativeItem[],
} as const;
