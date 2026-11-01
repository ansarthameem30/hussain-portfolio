import {
  ProfileSchema,
  ProfileData,
  StatsSchema,
  StatsData,
  ProjectsSchema,
  ProjectsData,
  SkillsSchema,
  SkillsData,
  ExperienceSchema,
  ExperienceData,
  CertificationsSchema,
  CertificationsData,
  WorkflowSchema,
  WorkflowData,
} from '@/data/schemas';

// Default static JSON bundles
import profileJson from '@/data/content/profile.json';
import statsJson from '@/data/content/stats.json';
import projectsJson from '@/data/content/projects.json';
import skillsJson from '@/data/content/skills.json';
import experienceJson from '@/data/content/experience.json';
import certificationsJson from '@/data/content/certifications.json';
import workflowJson from '@/data/content/workflow.json';

export function getProfile(): ProfileData {
  return ProfileSchema.parse(profileJson);
}

export function getStats(): StatsData {
  return StatsSchema.parse(statsJson);
}

export function getProjects(): ProjectsData {
  return ProjectsSchema.parse(projectsJson);
}

export function getSkills(): SkillsData {
  return SkillsSchema.parse(skillsJson);
}

export function getExperience(): ExperienceData {
  return ExperienceSchema.parse(experienceJson);
}

export function getCertifications(): CertificationsData {
  return CertificationsSchema.parse(certificationsJson);
}

export function getWorkflow(): WorkflowData {
  return WorkflowSchema.parse(workflowJson);
}

export type ContentType =
  | 'profile'
  | 'stats'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certifications'
  | 'workflow';

export function validateContent(type: ContentType, data: unknown): { success: true; data: any } | { success: false; error: any } {
  switch (type) {
    case 'profile': {
      const res = ProfileSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'stats': {
      const res = StatsSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'projects': {
      const res = ProjectsSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'skills': {
      const res = SkillsSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'experience': {
      const res = ExperienceSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'certifications': {
      const res = CertificationsSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    case 'workflow': {
      const res = WorkflowSchema.safeParse(data);
      return res.success ? { success: true, data: res.data } : { success: false, error: res.error };
    }
    default:
      return { success: false, error: new Error('Unknown content type') };
  }
}
