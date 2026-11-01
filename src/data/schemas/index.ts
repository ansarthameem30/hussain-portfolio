import { z } from 'zod';

// ==========================================
// 1. Profile Schema (Identity, Hero, Contact)
// ==========================================
export const ContactLinksSchema = z.object({
  email: z.string().email(),
  whatsapp: z.string(),
  whatsappMessage: z.string(),
  linkedin: z.string().url(),
  calendarLink: z.string(),
  resumeUrl: z.string(),
});

export const QuickFactSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string(),
  role: z.string(),
  tagline: z.string(),
  location: z.string(),
  availability: z.string(),
  shortBio: z.string(),
  fullBio: z.array(z.string()),
  quickFacts: z.array(QuickFactSchema),
  headline: z.string(),
  subheadline: z.string(),
  smallLine: z.string(),
  headshot: z.string(),
  contact: ContactLinksSchema,
});

export type ProfileData = z.infer<typeof ProfileSchema>;

// ==========================================
// 2. Stats Schema (Numbers Strip)
// ==========================================
export const StatItemSchema = z.object({
  id: z.string(),
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  decimals: z.number().optional(),
});

export const StatsSchema = z.array(StatItemSchema);
export type StatsData = z.infer<typeof StatsSchema>;

// ==========================================
// 3. Projects & Results Schema (Case Studies)
// ==========================================
export const HighlightTileSchema = z.object({
  id: z.string(),
  metric: z.string(),
  label: z.string(),
  positive: z.boolean(),
});

export const CaseStudyMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  positive: z.boolean(),
});

export const CaseStudySchema = z.object({
  id: z.string(),
  account: z.string(),
  headline: z.string(),
  subline: z.string().optional(),
  metrics: z.array(CaseStudyMetricSchema),
  whatIDid: z.array(z.string()),
  defaultOpen: z.boolean().optional(),
});

export const ProjectsSchema = z.object({
  sectionLabel: z.string(),
  highlights: z.array(HighlightTileSchema),
  caseStudies: z.array(CaseStudySchema),
});

export type ProjectsData = z.infer<typeof ProjectsSchema>;

// ==========================================
// 4. Skills & Expertise Schema
// ==========================================
export const SkillGroupSchema = z.object({
  id: z.string(),
  group: z.string(),
  skills: z.array(z.string()),
});

export const SkillsSchema = z.array(SkillGroupSchema);
export type SkillsData = z.infer<typeof SkillsSchema>;

// ==========================================
// 5. Experience & Education Schema
// ==========================================
export const ExperienceEntrySchema = z.object({
  id: z.string(),
  type: z.enum(['work', 'education']),
  title: z.string(),
  organisation: z.string(),
  location: z.string(),
  period: z.string(),
  highlights: z.array(z.string()),
  badge: z.string().optional(),
});

export const ExperienceSchema = z.array(ExperienceEntrySchema);
export type ExperienceData = z.infer<typeof ExperienceSchema>;

// ==========================================
// 6. Certifications Schema
// ==========================================
export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issued: z.string(),
  status: z.enum(['active', 'expired', 'no-expiry']),
  statusLabel: z.string(),
  credentialUrl: z.string().optional(),
});

export const CertificationsSchema = z.array(CertificationSchema);
export type CertificationsData = z.infer<typeof CertificationsSchema>;

// ==========================================
// 7. Workflow & Audit Checks Schema
// ==========================================
export const ProcessStepSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const CheckItemSchema = z.object({
  number: z.string(),
  title: z.string(),
  detail: z.string(),
  badge: z.string(),
});

export const WorkflowSchema = z.object({
  processSteps: z.array(ProcessStepSchema),
  threeChecks: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(CheckItemSchema),
  }),
  recommendations: z.object({
    title: z.string(),
    hasQuotes: z.boolean(),
    placeholderMessage: z.string(),
    quote: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
      company: z.string(),
    }).nullable(),
    note: z.string(),
  }),
  bookCall: z.object({
    title: z.string(),
    description: z.string(),
    calendarUrl: z.string(),
    duration: z.string(),
    format: z.string(),
    perks: z.array(z.string()),
    buttonLabel: z.string(),
  }),
});

export type WorkflowData = z.infer<typeof WorkflowSchema>;
