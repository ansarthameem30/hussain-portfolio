/**
 * Theme configuration
 * Executive Profiles:
 * 1. Royal Amethyst (Executive Obsidian Purple Dark) — DEFAULT
 * 2. Lavender Daylight (Luxe Light Purple)
 * 3. Executive Light (Crisp Apple / Stripe Daylight)
 * 4. Emerald Obsidian (Executive Dark Emerald & Gold)
 * 5. Midnight Cobalt (Luxury Navy Dark)
 */

export type ThemeId = "purple-dark" | "purple-light" | "light" | "deep-green" | "midnight";

export interface Theme {
  id: ThemeId;
  label: string;
  tagline: string;
  vibe: string;
  isLight?: boolean;
  preview: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
  colors: {
    // Background layers
    bgPrimary: string;
    bgSecondary: string;
    bgLight: string;
    bgCard: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textOnAccent: string;

    // Accent
    accent: string;
    accentHover: string;
    accentSubtle: string;

    // Border
    border: string;
    borderSubtle: string;

    // Status chips
    statusActive: string;
    statusActiveText: string;
    statusExpired: string;
    statusExpiredText: string;
    statusNoExpiry: string;
    statusNoExpiryText: string;

    // Gradient
    gradientStart: string;
    gradientEnd: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
    display: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    glow: string;
  };
  animations: {
    durationFast: string;
    durationNormal: string;
    durationSlow: string;
    easing: string;
    easingBounce: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  "purple-dark": {
    id: "purple-dark",
    label: "Royal Amethyst",
    tagline: "Executive obsidian violet with vibrant electric lilac & neon amethyst accents",
    vibe: "Royal Obsidian",
    isLight: false,
    preview: {
      bg: "#090514",
      card: "#140c29",
      accent: "#a855f7",
      text: "#fbfaff",
    },
    colors: {
      bgPrimary: "#090514",
      bgSecondary: "#0e0820",
      bgLight: "#160e2e",
      bgCard: "#130b28",
      textPrimary: "#fbfaff",
      textSecondary: "#b8abcf",
      textMuted: "#7e6f98",
      textOnAccent: "#ffffff",
      accent: "#a855f7",
      accentHover: "#c084fc",
      accentSubtle: "rgba(168, 85, 247, 0.15)",
      border: "rgba(168, 85, 247, 0.14)",
      borderSubtle: "rgba(168, 85, 247, 0.07)",
      statusActive: "#10b981",
      statusActiveText: "#ecfdf5",
      statusExpired: "#f43f5e",
      statusExpiredText: "#fff1f2",
      statusNoExpiry: "#c084fc",
      statusNoExpiryText: "#faf5ff",
      gradientStart: "#090514",
      gradientEnd: "#180f33",
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      full: "9999px",
    },
    shadows: {
      card: "0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px -5px rgba(168, 85, 247, 0.12)",
      cardHover: "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 30px -5px rgba(168, 85, 247, 0.25)",
      glow: "0 0 35px rgba(168, 85, 247, 0.3)",
    },
    animations: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  "purple-light": {
    id: "purple-light",
    label: "Lavender Daylight",
    tagline: "Crisp daylight canvas with soft royal lavender cards & vibrant purple accents",
    vibe: "Lavender Luxe",
    isLight: true,
    preview: {
      bg: "#faf8ff",
      card: "#ffffff",
      accent: "#7c3aed",
      text: "#1b1035",
    },
    colors: {
      bgPrimary: "#faf8ff",
      bgSecondary: "#ffffff",
      bgLight: "#f3eefa",
      bgCard: "#ffffff",
      textPrimary: "#1b1035",
      textSecondary: "#493b61",
      textMuted: "#79698f",
      textOnAccent: "#ffffff",
      accent: "#7c3aed",
      accentHover: "#6d28d9",
      accentSubtle: "rgba(124, 58, 237, 0.09)",
      border: "rgba(124, 58, 237, 0.14)",
      borderSubtle: "rgba(124, 58, 237, 0.06)",
      statusActive: "#059669",
      statusActiveText: "#065f46",
      statusExpired: "#e11d48",
      statusExpiredText: "#881337",
      statusNoExpiry: "#7c3aed",
      statusNoExpiryText: "#4c1d95",
      gradientStart: "#faf8ff",
      gradientEnd: "#f3eefa",
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      full: "9999px",
    },
    shadows: {
      card: "0 4px 20px -2px rgba(124, 58, 237, 0.07), 0 1px 3px 0 rgba(0, 0, 0, 0.04)",
      cardHover: "0 16px 32px -4px rgba(124, 58, 237, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
      glow: "0 0 25px rgba(124, 58, 237, 0.2)",
    },
    animations: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  "light": {
    id: "light",
    label: "Executive Light",
    tagline: "Crisp Apple & Stripe-grade daylight canvas with deep cobalt accents",
    vibe: "Daylight Crisp",
    isLight: true,
    preview: {
      bg: "#f8fafc",
      card: "#ffffff",
      accent: "#1d4ed8",
      text: "#0f172a",
    },
    colors: {
      bgPrimary: "#f8fafc",
      bgSecondary: "#ffffff",
      bgLight: "#f1f5f9",
      bgCard: "#ffffff",
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      textMuted: "#64748b",
      textOnAccent: "#ffffff",
      accent: "#1d4ed8",
      accentHover: "#1e40af",
      accentSubtle: "rgba(29, 78, 216, 0.08)",
      border: "rgba(15, 23, 42, 0.09)",
      borderSubtle: "rgba(15, 23, 42, 0.05)",
      statusActive: "#047857",
      statusActiveText: "#065f46",
      statusExpired: "#b91c1c",
      statusExpiredText: "#7f1d1d",
      statusNoExpiry: "#1d4ed8",
      statusNoExpiryText: "#1e3a8a",
      gradientStart: "#f8fafc",
      gradientEnd: "#f1f5f9",
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      full: "9999px",
    },
    shadows: {
      card: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
      cardHover: "0 16px 32px -4px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.04)",
      glow: "0 0 25px rgba(29, 78, 216, 0.15)",
    },
    animations: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  "deep-green": {
    id: "deep-green",
    label: "Emerald Obsidian",
    tagline: "Executive dark obsidian with refined emerald & champagne gold",
    vibe: "Executive Dark",
    isLight: false,
    preview: {
      bg: "#070d0a",
      card: "#112019",
      accent: "#ffd23f",
      text: "#f8fafc",
    },
    colors: {
      bgPrimary: "#070d0a",
      bgSecondary: "#0c1712",
      bgLight: "#101e18",
      bgCard: "#112019",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      textOnAccent: "#070d0a",
      accent: "#ffd23f",
      accentHover: "#ffe066",
      accentSubtle: "rgba(255, 210, 63, 0.12)",
      border: "rgba(255, 255, 255, 0.08)",
      borderSubtle: "rgba(255, 255, 255, 0.04)",
      statusActive: "#10b981",
      statusActiveText: "#ecfdf5",
      statusExpired: "#ef4444",
      statusExpiredText: "#fef2f2",
      statusNoExpiry: "#3b82f6",
      statusNoExpiryText: "#eff6ff",
      gradientStart: "#070d0a",
      gradientEnd: "#112019",
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      full: "9999px",
    },
    shadows: {
      card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      cardHover: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      glow: "0 0 35px rgba(255, 210, 63, 0.2)",
    },
    animations: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  "midnight": {
    id: "midnight",
    label: "Midnight Cobalt",
    tagline: "Deep luxury navy with electric ice blue accents",
    vibe: "Luxury Navy",
    isLight: false,
    preview: {
      bg: "#030712",
      card: "#0d1527",
      accent: "#38bdf8",
      text: "#f8fafc",
    },
    colors: {
      bgPrimary: "#030712",
      bgSecondary: "#080e1a",
      bgLight: "#0f172a",
      bgCard: "#0d1527",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      textOnAccent: "#030712",
      accent: "#38bdf8",
      accentHover: "#7dd3fc",
      accentSubtle: "rgba(56, 189, 248, 0.12)",
      border: "rgba(255, 255, 255, 0.08)",
      borderSubtle: "rgba(255, 255, 255, 0.04)",
      statusActive: "#10b981",
      statusActiveText: "#ecfdf5",
      statusExpired: "#ef4444",
      statusExpiredText: "#fef2f2",
      statusNoExpiry: "#8b5cf6",
      statusNoExpiryText: "#f5f3ff",
      gradientStart: "#030712",
      gradientEnd: "#0d1527",
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      full: "9999px",
    },
    shadows: {
      card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      cardHover: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      glow: "0 0 35px rgba(56, 189, 248, 0.2)",
    },
    animations: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },
};

/** The theme that loads first */
export const defaultTheme: ThemeId = "deep-green";

/**
 * Converts a theme object into CSS custom properties string.
 * Used by ThemeProvider to inject styles into :root.
 */
export function themeToCSS(theme: Theme): string {
  const c = theme.colors;
  const f = theme.fonts;
  const r = theme.borderRadius;
  const s = theme.shadows;
  const a = theme.animations;
  const isLight = Boolean(theme.isLight);

  return `
    --bg-primary: ${c.bgPrimary};
    --bg-secondary: ${c.bgSecondary};
    --bg-light: ${c.bgLight};
    --bg-card: ${c.bgCard};
    --text-primary: ${c.textPrimary};
    --text-secondary: ${c.textSecondary};
    --text-muted: ${c.textMuted};
    --text-on-accent: ${c.textOnAccent};
    --accent: ${c.accent};
    --accent-hover: ${c.accentHover};
    --accent-subtle: ${c.accentSubtle};
    --border: ${c.border};
    --border-subtle: ${c.borderSubtle};
    --status-active: ${c.statusActive};
    --status-active-text: ${c.statusActiveText};
    --status-expired: ${c.statusExpired};
    --status-expired-text: ${c.statusExpiredText};
    --status-no-expiry: ${c.statusNoExpiry};
    --status-no-expiry-text: ${c.statusNoExpiryText};
    --gradient-start: ${c.gradientStart};
    --gradient-end: ${c.gradientEnd};
    --font-heading: ${f.heading};
    --font-body: ${f.body};
    --font-mono: ${f.mono};
    --font-display: ${f.display};
    --radius-sm: ${r.sm};
    --radius-md: ${r.md};
    --radius-lg: ${r.lg};
    --radius-xl: ${r.xl};
    --radius-full: ${r.full};
    --shadow-card: ${s.card};
    --shadow-card-hover: ${s.cardHover};
    --shadow-glow: ${s.glow};
    --duration-fast: ${a.durationFast};
    --duration-normal: ${a.durationNormal};
    --duration-slow: ${a.durationSlow};
    --easing: ${a.easing};
    --easing-bounce: ${a.easingBounce};
    --surface-overlay: ${isLight ? 'rgba(124, 58, 237, 0.04)' : 'rgba(255, 255, 255, 0.04)'};
    --surface-hover: ${isLight ? 'rgba(124, 58, 237, 0.08)' : 'rgba(255, 255, 255, 0.08)'};
    --border-hover: ${isLight ? 'rgba(124, 58, 237, 0.25)' : 'rgba(168, 85, 247, 0.3)'};
    --input-bg: ${isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.35)'};
    --input-border: ${isLight ? 'rgba(124, 58, 237, 0.2)' : 'rgba(168, 85, 247, 0.2)'};
    --mesh-opacity: ${isLight ? '0.15' : '1'};
    --is-light-mode: ${isLight ? '1' : '0'};
  `;
}
